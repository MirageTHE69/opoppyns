"use client";

import { useEffect, useMemo, useRef } from "react";
import { quote } from "@/content/home";

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Deterministic scatter for word i: [x vw, y vh, rotate deg]. */
const scatter = (i: number): [number, number, number] => {
  const sx = i % 2 === 0 ? -1 : 1;
  const sy = Math.floor(i / 2) % 2 === 0 ? -1 : 1;
  return [sx * (32 + ((i * 23) % 30)), sy * (22 + ((i * 31) % 32)), sx * sy * (10 + ((i * 13) % 16))];
};

/**
 * Pinned scroll scene: scattered, blurred, rotated words fly together into
 * one sentence as you scroll through a 320svh track.
 */
export default function Quote({ k = 1.6 }: { k?: number }) {
  const words = useMemo(() => quote.text.split(" "), []);
  const secRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const subRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = secRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = wordRefs.current.length;
    let raf = 0;

    const upd = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const p = clamp01(total > 0 ? -r.top / total : 0);
      const tp = reduce ? 1 : ease(Math.min(1, p / 0.78));
      // spread the stagger across however many words there are
      const step = 0.28 / Math.max(1, n - 1);
      wordRefs.current.forEach((w, i) => {
        const [fx, fy, rot] = scatter(i);
        const s = ease(clamp01((tp - i * step) / 0.7));
        const inv = 1 - s;
        w.style.transform = `translate(${fx * inv * k}vw,${fy * inv * k * 0.6}vh) rotate(${rot * inv}deg) scale(${1 + inv * 0.22})`;
        w.style.opacity = String(clamp01(s * 1.5));
        w.style.filter = `blur(${(inv * 7).toFixed(2)}px)`;
      });
      if (subRef.current) {
        if (p > 0.82) subRef.current.setAttribute("data-on", "");
        else subRef.current.removeAttribute("data-on");
      }
      if (fillRef.current) fillRef.current.style.width = p * 100 + "%";
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(upd);
    };

    upd();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [k]);

  const accentFrom = words.length - quote.accentLast;

  return (
    <section ref={secRef} id="quote" className="merge" data-theme="light" data-num="05">
      <div className="merge-stick">
        <div className="merge-label mono">{quote.label}</div>
        <blockquote className="merge-line">
          {words.map((w, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) wordRefs.current[i] = el;
              }}
              className={i >= accentFrom ? "accent" : undefined}
              style={{ opacity: 0 }}
            >
              {i === 0 ? "“" : ""}
              {w}
              {i === words.length - 1 ? "”" : ""}
            </span>
          ))}
        </blockquote>
        <div ref={subRef} className="merge-sub merge-by">
          {quote.by}
        </div>
        <div className="merge-track">
          <div ref={fillRef} />
        </div>
      </div>
    </section>
  );
}
