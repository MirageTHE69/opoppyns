"use client";

import { useRef } from "react";
import { atmosphere } from "@/content/home";
import { Glyphs } from "@/components/shared/Icon";

type Blob = { x: number; y: number; r: number; c: string };

/** Moving the cursor leaves soft, blurred pools of colour behind it. */
export default function Atmosphere() {
  const secRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const blobs = useRef<Blob[]>([]);
  const hueIdx = useRef(0);
  const last = useRef(0);

  const paint = () => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.style.background = blobs.current
      .map((b) => `radial-gradient(${b.r}px ${b.r * 0.72}px at ${b.x}px ${b.y}px, ${b.c}66, rgba(0,0,0,0) 70%)`)
      .join(",");
    layer.style.opacity = blobs.current.length ? "1" : "0";
  };

  const onMove = (e: React.MouseEvent) => {
    const now = performance.now();
    if (now - last.current < 90) return;
    last.current = now;
    const r = secRef.current!.getBoundingClientRect();
    const { hues } = atmosphere;
    blobs.current.push({
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      r: 150 + Math.random() * 160,
      c: hues[hueIdx.current++ % hues.length],
    });
    if (blobs.current.length > 16) blobs.current.shift();
    paint();
  };

  const clear = () => {
    blobs.current = [];
    paint();
  };

  return (
    <section
      ref={secRef}
      id="s02"
      className="atmos"
      data-theme="dark"
      data-num="03"
      onMouseMove={onMove}
    >
      <div ref={layerRef} className="atmos-glow" />
      <div className="atmos-top">
        <div className="mono">{atmosphere.label}</div>
      </div>
      <div className="atmos-body">
        <h2 data-rise="">
          {atmosphere.title[0]}
          <br />
          <span className="it">{atmosphere.title[1]}</span>
        </h2>
        <p className="atmos-sub">{atmosphere.sub}</p>
      </div>
      <div className="atmos-foot">
        <button className="atmos-clear" onClick={clear}>
          <Glyphs text={atmosphere.clear} />
        </button>
      </div>
    </section>
  );
}
