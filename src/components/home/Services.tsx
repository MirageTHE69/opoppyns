"use client";

import { useEffect, useRef, useState } from "react";
import { services } from "@/content/home";
import { ACCENT } from "@/content/site";

function Group({
  n,
  title,
  items,
  open,
  touched,
  onToggle,
}: {
  n: number;
  title: string;
  items: string[];
  open: boolean;
  touched: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // Animate height between 0 and the content's natural height, then release
  // to "auto" so the panel reflows with the viewport.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (first.current) {
      first.current = false;
      el.style.height = open ? "auto" : "0px";
      return;
    }
    if (open) {
      el.style.height = el.scrollHeight + "px";
      const t = setTimeout(() => (el.style.height = "auto"), 520);
      return () => clearTimeout(t);
    }
    el.style.height = el.scrollHeight + "px";
    void el.offsetHeight;
    requestAnimationFrame(() => (el.style.height = "0px"));
  }, [open]);

  // Before any interaction the open row wears poppy red; after, the accent.
  const activeColor = touched ? ACCENT : "var(--red)";

  return (
    <div className="acc-item" data-open={open ? "" : undefined}>
      <button className="acc-head" onClick={onToggle} aria-expanded={open}>
        <span className="acc-num">{String(n).padStart(2, "0")}</span>
        <span className="acc-title" style={open ? { color: activeColor } : undefined}>
          {title}
        </span>
        <span className="acc-meta">
          <span className="acc-count">{String(items.length).padStart(2, "0")} SERVICES</span>
          <span className="acc-sign">{open ? "−" : "+"}</span>
        </span>
      </button>
      <div ref={bodyRef} className="acc-body" style={{ height: open ? "auto" : 0 }}>
        <ul className="svc-list">
          {items.map((it, i) => (
            <li key={it} style={{ transitionDelay: open ? `${0.08 + i * 0.05}s` : "0s" }}>
              <span className="ast">✳</span>
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Services() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [touched, setTouched] = useState(false);

  return (
    <section id="services" className="useful" data-theme="light" data-num="04">
      <div data-reveal="" className="mono">
        {services.label}
      </div>
      <div className="acc">
        {services.groups.map((g, i) => (
          <Group
            key={g.title}
            n={i + 1}
            title={g.title}
            items={g.items}
            open={openIdx === i}
            touched={touched}
            onToggle={() => {
              setTouched(true);
              setOpenIdx((cur) => (cur === i ? null : i));
            }}
          />
        ))}
      </div>
    </section>
  );
}
