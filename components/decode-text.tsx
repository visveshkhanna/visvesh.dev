"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "01<>/\\{}[]#$%&*+=~_|";

type DecodeTextProps = {
  text: string;
  className?: string;
};

/**
 * Text that scrambles into code-like glyphs and resolves left to right when
 * the pointer enters (or focus lands in) its nearest `[data-decode]` ancestor,
 * or failing that its enclosing link or button.
 * The real text stays in the DOM for layout and screen readers; the scramble is
 * drawn in an overlay so nothing shifts.
 */
export function DecodeText({ text, className }: DecodeTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const overlay = overlayRef.current;
    if (!root || !overlay) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const trigger =
      root.closest("[data-decode]") ?? root.closest("a, button") ?? root;
    let frame = 0;

    const stop = () => {
      cancelAnimationFrame(frame);
      root.dataset.active = "false";
      overlay.textContent = "";
    };

    const start = () => {
      stop();
      const chars = text.split("");
      const duration = Math.min(760, 200 + 20 * chars.length);
      // Each character resolves at a slightly jittered point along the text.
      const resolveAt = chars.map(
        (_, i) => (i / chars.length) * 0.75 + Math.random() * 0.25
      );
      const begin = performance.now();
      root.dataset.active = "true";

      const tick = (now: number) => {
        const t = (now - begin) / duration;
        if (t >= 1) return stop();
        overlay.textContent = chars
          .map((ch, i) =>
            ch === " " || t >= resolveAt[i]
              ? ch
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join("");
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    trigger.addEventListener("pointerenter", start);
    trigger.addEventListener("focusin", start);
    return () => {
      trigger.removeEventListener("pointerenter", start);
      trigger.removeEventListener("focusin", start);
      stop();
    };
  }, [text]);

  return (
    <span ref={rootRef} className={`decode ${className ?? ""}`}>
      <span className="decode-text">{text}</span>
      <span ref={overlayRef} className="decode-overlay" aria-hidden="true" />
    </span>
  );
}
