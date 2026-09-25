"use client";

import { useEffect, useRef, useState } from "react";
import { hero, splash } from "@/content/home";

// The intro plays once per full page load, not on every client-side return to "/".
let splashPlayed = false;

const EASE_DOCK = "cubic-bezier(.62,.02,.16,1)";

export default function HeroIntro({ showSplash = true }: { showSplash?: boolean }) {
  const [phase, setPhase] = useState<"splash" | "docked">(() =>
    showSplash && !splashPlayed ? "splash" : "docked"
  );
  const [overlay, setOverlay] = useState(phase === "splash");

  const wrapRef = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const ledeRef = useRef<HTMLParagraphElement>(null);

  // Keep the muted showreel playing no matter what the browser tries.
  useEffect(() => {
    const vid = vidRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.defaultMuted = true;
    const kick = () => {
      const p = vid.play();
      if (p && p.catch) p.catch(() => {});
    };
    kick();
    const onPause = () => setTimeout(kick, 60);
    const onVis = () => !document.hidden && kick();
    vid.addEventListener("pause", onPause);
    vid.addEventListener("ended", kick);
    document.addEventListener("visibilitychange", onVis);
    const iv = setInterval(() => vid.paused && kick(), 1500);
    return () => {
      vid.removeEventListener("pause", onPause);
      vid.removeEventListener("ended", kick);
      document.removeEventListener("visibilitychange", onVis);
      clearInterval(iv);
    };
  }, []);

  useEffect(() => {
    const words = wordRefs.current;
    const lede = ledeRef.current;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    const revealHero = (delayMs: number) => {
      const d = delayMs / 1000;
      requestAnimationFrame(() => {
        words.forEach((w, i) => {
          const t = d + i * 0.075;
          w.style.transition = `opacity .85s cubic-bezier(.2,.7,.2,1) ${t}s, transform .95s cubic-bezier(.2,.7,.2,1) ${t}s`;
          w.style.opacity = "1";
          w.style.transform = "none";
        });
        if (lede) {
          lede.style.transition = `opacity .8s ease ${d + 0.45}s, transform .8s cubic-bezier(.2,.7,.2,1) ${d + 0.45}s`;
          lede.style.opacity = "1";
          lede.style.transform = "none";
        }
      });
    };

    if (phase === "docked") {
      revealHero(100);
      return () => timers.forEach(clearTimeout);
    }

    // ---- Splash sequence ----
    splashPlayed = true;
    const wrap = wrapRef.current!;
    const vid = vidRef.current!;
    const slot = slotRef.current!;
    const shell = shellRef.current;
    const ui = uiRef.current;
    const c = countRef.current;

    document.body.style.overflow = "hidden";

    // Aperture: the film opens out of a dot while slowly pushing in.
    vid.style.transform = "scale(1.3)";
    vid.style.transition = "transform 4.2s cubic-bezier(.12,.62,.2,1)";
    later(() => {
      wrap.style.transition = "clip-path 1.9s cubic-bezier(.22,.78,.18,1)";
      wrap.style.clipPath = "circle(145% at 50% 46%)";
      vid.style.transform = "scale(1.06)";
      ui?.setAttribute("data-lit", "");
    }, 520);

    const dur = 2700;
    const t0 = performance.now();
    let done = false;
    let raf = 0;

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      if (c) c.textContent = "100";
      // Splash type lifts away first...
      if (ui) {
        ui.style.opacity = "0";
        ui.style.transform = "scale(1.08) translateY(-14px)";
      }
      later(() => {
        document.body.style.overflow = "";
        window.scrollTo(0, 0);
        // ...then the same playing frame eases down into the hero band
        // while the headline rises to meet it.
        const r = slot.getBoundingClientRect();
        wrap.style.transition = "none";
        wrap.style.top = "0px";
        wrap.style.left = "0px";
        wrap.style.width = window.innerWidth + "px";
        wrap.style.height = window.innerHeight + "px";
        void wrap.offsetHeight;
        wrap.style.transition = ["top", "left", "width", "height"]
          .map((p) => `${p} 1.45s ${EASE_DOCK}`)
          .join(",");
        wrap.style.top = r.top + "px";
        wrap.style.left = r.left + "px";
        wrap.style.width = r.width + "px";
        wrap.style.height = r.height + "px";
        vid.style.transition = `transform 1.45s ${EASE_DOCK}`;
        vid.style.transform = "scale(1.16)";
        if (shell) shell.style.opacity = "0";
        revealHero(300);
        later(() => {
          wrap.style.cssText = "";
          setPhase("docked");
          setOverlay(false);
        }, 1520);
      }, 520);
    };

    const tick = (t: number) => {
      if (done) return;
      const p = Math.min(1, (t - t0) / dur);
      if (c) c.textContent = String(Math.round(p * 100)).padStart(3, "0");
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    later(finish, dur + 900);
    const onVis = () => {
      if (!document.hidden && performance.now() - t0 > dur) finish();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      document.body.style.overflow = "";
    };
    // The splash only ever runs from the initial phase.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let wi = 0;
  const setWord = (el: HTMLSpanElement | null) => {
    if (el) wordRefs.current[wi++] = el;
  };

  return (
    <>
      {overlay && (
        <>
          <div ref={shellRef} className="splash-shell" />
          <div ref={uiRef} className="splash-ui" aria-hidden>
            <div className="splash-logo">
              <span className="splash-word">{splash.wordmark}</span>
              <span className="splash-ast">*</span>
            </div>
            <div className="splash-sub">{splash.sub}</div>
            <div className="splash-foot">
              <span>{splash.footLeft}</span>
              <span ref={countRef}>000</span>
            </div>
          </div>
        </>
      )}

      <section id="top" className="hero" data-theme="light" data-num="01">
        <div className="hero-blob" />
        <div className="hero-eyebrows mono">
          <div data-reveal="" className="sub">
            {hero.eyebrow} <span>✳</span>
          </div>
        </div>

        <h1 className="hero-title">
          {hero.headline.map((line, li) => (
            <span key={li}>
              {line.map((w, i) => (
                <span key={i}>
                  <span ref={setWord} className={w.italic ? "hero-word it" : "hero-word"}>
                    {w.text}
                    {w.dot && <span className="red">.</span>}
                  </span>
                  {i < line.length - 1 ? " " : null}
                </span>
              ))}
              {li < hero.headline.length - 1 && <br />}
            </span>
          ))}
        </h1>

        <div className="hero-row">
          <div ref={slotRef} className="hero-slot" data-heroslot="">
            <div ref={wrapRef} className="vidwrap" data-state={phase}>
              <video
                ref={vidRef}
                src={splash.videoSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              <div className="vid-vignette" />
              <div className="vid-label">
                <span>✳</span> {splash.videoLabel}
              </div>
            </div>
          </div>
          <p ref={ledeRef} className="hero-lede">
            {hero.lede}
          </p>
        </div>

        <div className="hero-foot">
          <a data-reveal="" href={hero.cta.href} className="hero-cta">
            {hero.cta.label} <span>↗</span>
          </a>
          <div className="hero-counter" data-counter="">
            01&nbsp;/&nbsp;09
          </div>
        </div>
      </section>
    </>
  );
}
