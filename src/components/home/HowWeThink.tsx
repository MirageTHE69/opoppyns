"use client";

import { useEffect, useRef } from "react";
import { howWeThink } from "@/content/home";

/**
 * Five process words scattered across a yellow field. They stagger in on
 * first view, then drift at different depths as the mouse moves.
 */
export default function HowWeThink() {
  const mapRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<HTMLDivElement[]>([]);
  const shown = useRef(false);

  useEffect(() => {
    const map = mapRef.current!;
    const words = wordRefs.current;
    words.forEach((w, i) => {
      w.style.transition = `opacity .8s cubic-bezier(.2,.7,.2,1) ${i * 0.12}s, transform .8s cubic-bezier(.2,.7,.2,1) ${i * 0.12}s`;
    });
    const showAll = () => {
      shown.current = true;
      words.forEach((w) => {
        w.style.opacity = "1";
        w.style.transform = "none";
      });
    };
    const check = () => {
      if (shown.current) return;
      const r = map.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85 && r.bottom > 0) showAll();
    };
    check();
    const t1 = setTimeout(check, 300);
    const t2 = setTimeout(() => !shown.current && showAll(), 6000);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  const onMove = (e: React.MouseEvent) => {
    if (!shown.current || window.innerWidth < 760) return;
    const r = mapRef.current!.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    wordRefs.current.forEach((w, i) => {
      const d = howWeThink.words[i].depth;
      w.style.transition = "transform .6s cubic-bezier(.2,.7,.2,1)";
      w.style.transform = `translate(${dx * d * 22}px,${dy * d * 18}px)`;
    });
  };

  return (
    <section id="thinking" className="think" data-theme="yellow" data-num="06">
      <div className="think-top">
        <div className="mono">{howWeThink.label}</div>
      </div>
      <div ref={mapRef} className="wordmap" onMouseMove={onMove}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <line x1="8" y1="72" x2="92" y2="40" stroke="#1A1A18" strokeWidth=".12" />
        </svg>
        {howWeThink.words.map((w, i) => (
          <div
            key={w.word}
            ref={(el) => {
              if (el) wordRefs.current[i] = el;
            }}
            className="mapword"
            style={{ left: `${w.left}%`, top: `${w.top}%` }}
          >
            <div className="n">{w.n}</div>
            <div className="w">{w.word}</div>
            <div className="note">{w.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
