"use client";

import { useEffect } from "react";

type Props = {
  /** red reading-progress rule along the top edge */
  progress?: boolean;
  /** scroll-velocity skew on [data-marq] tickers */
  marquee?: boolean;
  /** parallax drift on [data-plx] images and the docked hero film */
  parallax?: boolean;
  /** motion intensity multiplier (design "heavy" = 1.7) */
  k?: number;
  /** update "01 / 07" style counter in [data-counter] from [data-num] sections */
  counter?: boolean;
};

/**
 * One controller for page-wide scroll choreography, driven by a single rAF
 * loop that runs only while something is moving:
 *  - [data-reveal] fade-ups and [data-rise] masked heading rises
 *  - reading progress bar
 *  - parallax on stills + hero film
 *  - marquee skew that leans into scroll speed then eases back flat
 *  - section counter
 */
export default function ScrollEffects({ progress, marquee, parallax, k = 1, counter }: Props) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fill = document.querySelector<HTMLElement>("[data-scrollfill]");
    const marqs = marquee ? Array.from(document.querySelectorAll<HTMLElement>("[data-marq]")) : [];
    const stills = parallax ? Array.from(document.querySelectorAll<HTMLElement>("[data-plx]")) : [];
    const counterEl = counter ? document.querySelector<HTMLElement>("[data-counter]") : null;
    const numbered = counter ? Array.from(document.querySelectorAll<HTMLElement>("[data-num]")) : [];

    let reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let rises = Array.from(document.querySelectorAll<HTMLElement>("[data-rise]"));

    let lastY = window.scrollY;
    let vel = 0;
    let raf = 0;
    let idle = 0;

    const frame = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;

      if (reveals.length) {
        reveals = reveals.filter((el) => {
          const b = el.getBoundingClientRect();
          if (b.top < vh * 0.92 && b.bottom > 0) {
            el.classList.add("is-in");
            return false;
          }
          return true;
        });
      }
      if (rises.length) {
        rises = rises.filter((el) => {
          const b = el.getBoundingClientRect();
          if (b.top < vh * 0.9 && b.bottom > 0) {
            el.classList.add("is-in");
            return false;
          }
          return true;
        });
      }

      if (fill) {
        const max = Math.max(1, document.documentElement.scrollHeight - vh);
        fill.style.width = Math.min(100, (y / max) * 100) + "%";
      }

      if (counterEl && numbered.length) {
        let n = 1;
        numbered.forEach((s, i) => {
          if (s.getBoundingClientRect().top <= vh * 0.5) n = i + 1;
        });
        counterEl.textContent =
          String(n).padStart(2, "0") + " / " + String(numbered.length).padStart(2, "0");
      }

      if (parallax && !reduce) {
        const film = document.querySelector<HTMLElement>('[data-heroslot] [data-state="docked"] video');
        if (film) {
          const b = film.getBoundingClientRect();
          const p = (b.top + b.height / 2 - vh / 2) / vh;
          film.style.transform = "scale(1.16) translateY(" + (p * -22 * k).toFixed(2) + "px)";
        }
        stills.forEach((img) => {
          const b = img.getBoundingClientRect();
          if (b.bottom < -200 || b.top > vh + 200) return;
          const p = (b.top + b.height / 2 - vh / 2) / vh;
          img.style.transform = "scale(1.18) translateY(" + (p * -26 * k).toFixed(2) + "px)";
        });
      }

      const delta = y - lastY;
      lastY = y;
      if (marqs.length && !reduce) {
        vel += (delta - vel) * 0.18;
        if (Math.abs(vel) < 0.04) vel = 0;
        const skew = Math.max(-2.6, Math.min(2.6, vel * 0.18 * k));
        marqs.forEach((m) => (m.style.transform = "skewX(" + skew.toFixed(2) + "deg)"));
      } else {
        vel = 0;
      }

      // keep stepping until everything has settled
      if (vel !== 0 || delta !== 0) idle = 0;
      else idle++;
      if (idle < 12) schedule();
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      idle = 0;
      schedule();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    schedule();
    const t1 = setTimeout(onScroll, 300);
    // safety net: never leave content permanently hidden
    const t2 = setTimeout(() => {
      document.querySelectorAll("[data-reveal],[data-rise]").forEach((el) => el.classList.add("is-in"));
    }, 7000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [progress, marquee, parallax, k, counter]);

  return progress ? (
    <div className="scrollbar" aria-hidden>
      <div data-scrollfill="" />
    </div>
  ) : null;
}
