"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/content/site";
import Icon from "@/components/shared/Icon";
import Logo from "@/components/shared/Logo";

type Props = {
  /** key of the nav link to mark as current page */
  active?: string;
  /** where the "Let's talk" CTA points on this page */
  talkHref: string;
};

/**
 * Fixed top nav. Its ink flips to light whenever the section under it
 * is dark or red (sections declare this with data-theme).
 */
export default function Nav({ active, talkHref }: Props) {
  // dark = charcoal text (light bg), light = cream text (dark bg), red = cream text + all-cream logo (red bg)
  const [ink, setInk] = useState<"dark" | "light" | "red">("dark");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const secs = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]"));
    const update = () => {
      let cur = "light";
      for (const s of secs) {
        const r = s.getBoundingClientRect();
        if (r.top <= 40 && r.bottom > 40) cur = s.dataset.theme || "light";
      }
      setInk(cur === "red" ? "red" : cur === "dark" ? "light" : "dark");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Lock page scroll while the drawer is open; close it if we grow past mobile.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const mq = window.matchMedia("(min-width: 760px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav className="nav" data-ink={ink}>
        <Link href="/#top" className="nav-logo" aria-label="Poppyns home">
          <Logo priority />
        </Link>
        <div className="nav-links">
          {navLinks.map((l) => (
            <Link key={l.key} href={l.href} data-active={l.key === active ? "" : undefined}>
              {l.label}
            </Link>
          ))}
        </div>
        <a className="nav-cta" href={talkHref}>
          Let&apos;s talk <Icon name="arrow-up-right" />
        </a>
        <button className="nav-burger" onClick={() => setOpen(true)} aria-expanded={open}>
          MENU
        </button>
      </nav>

      <div className="drawer" data-open={open ? "" : undefined} role="dialog" aria-modal="true" aria-hidden={!open}>
        <button className="drawer-close" onClick={close}>
          CLOSE <Icon name="asterisk" />
        </button>
        <div className="drawer-links">
          {navLinks.map((l) => (
            <Link key={l.key} href={l.href} onClick={close} data-active={l.key === active ? "" : undefined}>
              {l.label}
            </Link>
          ))}
          <a
            href={talkHref}
            onClick={close}
            style={{ fontStyle: "italic", color: active ? undefined : "var(--red)" }}
          >
            Let&apos;s talk <Icon name="arrow-up-right" />
          </a>
        </div>
        <div className="drawer-mail">{site.email}</div>
      </div>
    </>
  );
}
