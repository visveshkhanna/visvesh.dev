"use client";

import { useEffect, useRef } from "react";

/** Characters a trail cell steps through as it fades, dense to faint. */
const RAMP = "@%#*+=-:.";
const TRAIL_MS = 650;
const CELL_HEIGHT = 14;
const LOCK_MS = 140;
const INTERACTIVE = 'a, button, summary, label, select, [role="button"]';
const TEXT_FIELD = 'input, textarea, [contenteditable="true"]';

type Mode = "hidden" | "cross" | "lock" | "native";

/** Shift on its own shows the ruler; Shift as part of a shortcut does not. */
function isRulerChord(e: KeyboardEvent | PointerEvent) {
  return e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey;
}

/** What a click on `el` will do, as a single glyph drawn inside the brackets. */
function intentGlyph(el: Element): string {
  const expanded = el.getAttribute("aria-expanded");
  if (expanded !== null) return expanded === "true" ? "−" : "+";
  if (el instanceof HTMLAnchorElement) {
    if (el.protocol === "mailto:") return "@";
    const sameDoc =
      el.host === location.host && el.pathname === location.pathname;
    if (sameDoc && el.hash) return "↓";
    return el.target === "_blank" || el.host !== location.host ? "↗" : "→";
  }
  return "↵";
}

/**
 * Replaces the mouse pointer with a canvas-drawn crosshair that leaves a
 * fading ASCII trail, locks onto links and buttons with corner brackets and an
 * intent glyph, and shows page coordinates while Shift is held.
 * Renders nothing on touch devices.
 */
export function CrosshairCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!canvas || !ctx || !finePointer.matches) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const root = document.documentElement;
    const monoFamily =
      getComputedStyle(document.body).getPropertyValue("--font-geist-mono") ||
      "ui-monospace, monospace";
    const font = `500 12px ${monoFamily}`;

    let cellWidth = 7.2;
    let x = -100;
    let y = -100;
    let lastCol = -1;
    let lastRow = -1;
    let mode: Mode = "hidden";
    let target: Element | null = null;
    let glyph = "↵";
    let lockStart = 0;
    let shift = false;
    let frame = 0;
    const trail = new Map<string, { col: number; row: number; born: number }>();

    root.classList.add("has-crosshair");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = font;
      cellWidth = ctx.measureText("M").width || 7.2;
      schedule();
    };

    const draw = (now: number) => {
      frame = 0;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const style = getComputedStyle(document.body);
      const ink = style.color;
      const ground = style.backgroundColor;
      let animating = false;

      ctx.clearRect(0, 0, w, h);
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = ink;

      for (const [key, cell] of trail) {
        // rAF's timestamp is the frame's start, which can be a few ms before
        // the performance.now() a cell was stamped with, so clamp at zero.
        const age = Math.max(0, now - cell.born);
        if (age >= TRAIL_MS) {
          trail.delete(key);
          continue;
        }
        const t = age / TRAIL_MS;
        ctx.globalAlpha = 0.5 * (1 - t);
        ctx.fillText(
          RAMP[Math.min(RAMP.length - 1, Math.floor(t * RAMP.length))],
          (cell.col + 0.5) * cellWidth,
          (cell.row + 0.5) * CELL_HEIGHT
        );
        animating = true;
      }
      ctx.globalAlpha = 1;

      if (mode === "hidden" || mode === "native") {
        if (animating) schedule();
        return;
      }

      const cx = Math.round(x);
      const cy = Math.round(y);

      if (shift) {
        ctx.globalAlpha = 0.25;
        ctx.fillRect(0, cy, w, 1);
        ctx.fillRect(cx, 0, 1, h);
        ctx.globalAlpha = 1;

        const label = `x ${cx + Math.round(window.scrollX)}  y ${cy + Math.round(window.scrollY)}`;
        ctx.textAlign = "left";
        const lw = Math.ceil(ctx.measureText(label).width) + 10;
        const lx = Math.max(4, Math.min(w - lw - 4, cx + 12));
        const ly = Math.max(4, Math.min(h - 22, cy + 12));
        ctx.fillRect(lx, ly, lw, 18);
        ctx.fillStyle = ground;
        ctx.fillText(label, lx + 5, ly + 9.5);
        ctx.fillStyle = ink;
        ctx.textAlign = "center";
      }

      if (mode === "cross") {
        ctx.fillRect(cx - 7, cy, 15, 1);
        ctx.fillRect(cx, cy - 7, 1, 15);
      } else {
        const p = reduceMotion ? 1 : Math.min(1, Math.max(0, now - lockStart) / LOCK_MS);
        const eased = 1 - Math.pow(1 - p, 3);
        const r = Math.round(15 - 5 * eased);
        const arm = 5;

        ctx.globalAlpha = eased;
        ctx.fillStyle = ground;
        ctx.fillRect(cx - r + 1, cy - r + 1, 2 * r - 1, 2 * r - 1);
        ctx.fillStyle = ink;
        ctx.globalAlpha = 1;
        for (const sx of [-1, 1]) {
          for (const sy of [-1, 1]) {
            const px = cx + sx * r;
            const py = cy + sy * r;
            ctx.fillRect(sx < 0 ? px : px - arm + 1, py, arm, 1);
            ctx.fillRect(px, sy < 0 ? py : py - arm + 1, 1, arm);
          }
        }
        ctx.globalAlpha = eased;
        ctx.fillText(glyph, cx + 0.5, cy + 1);
        ctx.globalAlpha = 1;
        if (p < 1) animating = true;
      }

      if (animating) schedule();
    };

    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    const stamp = (col: number, row: number, born: number) => {
      trail.set(`${col}:${row}`, { col, row, born });
    };

    /** Work out the mode for whatever element sits under the pointer. */
    const resolve = (el: Element | null) => {
      if (el?.closest(TEXT_FIELD)) {
        mode = "native";
        target = null;
        return;
      }
      const hit = el?.closest(INTERACTIVE) ?? null;
      const next: Mode = hit && !shift ? "lock" : "cross";
      if (next === "lock" && hit !== target) lockStart = performance.now();
      target = hit;
      if (hit) glyph = intentGlyph(hit);
      mode = next;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      // The event's own modifier state is the source of truth: a keyup can be
      // swallowed (⌘⇧4 screenshots, shortcuts that move focus), which would
      // otherwise leave the ruler stuck on.
      shift = isRulerChord(e);
      resolve(e.target as Element | null);

      const col = Math.floor(x / cellWidth);
      const row = Math.floor(y / CELL_HEIGHT);
      if (
        !reduceMotion &&
        !shift &&
        mode === "cross" &&
        (col !== lastCol || row !== lastRow)
      ) {
        const now = performance.now();
        if (lastCol >= 0) {
          // Fill the gap on fast moves so the trail stays continuous.
          const steps = Math.min(
            24,
            Math.max(Math.abs(col - lastCol), Math.abs(row - lastRow))
          );
          for (let i = 1; i < steps; i++) {
            stamp(
              Math.round(lastCol + ((col - lastCol) * i) / steps),
              Math.round(lastRow + ((row - lastRow) * i) / steps),
              now
            );
          }
        }
        stamp(col, row, now);
      }
      lastCol = col;
      lastRow = row;
      schedule();
    };

    const onScroll = () => {
      if (mode !== "hidden") resolve(document.elementFromPoint(x, y));
      schedule();
    };

    // Toggles like aria-expanded change after the click handler runs.
    const onClick = () =>
      window.setTimeout(() => {
        if (target) glyph = intentGlyph(target);
        schedule();
      }, 0);

    const setShift = (on: boolean) => {
      if (shift === on) return;
      shift = on;
      if (mode !== "hidden") resolve(document.elementFromPoint(x, y));
      schedule();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      setShift(
        isRulerChord(e) && !document.activeElement?.closest(TEXT_FIELD)
      );
    };
    const onKeyUp = (e: KeyboardEvent) => setShift(isRulerChord(e));
    const onBlur = () => setShift(false);
    const onVisibility = () => {
      if (document.hidden) setShift(false);
    };
    const onLeave = () => {
      mode = "hidden";
      lastCol = -1;
      schedule();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("pointerleave", onLeave);
      root.classList.remove("has-crosshair");
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full"
    />
  );
}
