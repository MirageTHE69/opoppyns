import Link from "next/link";
import { site } from "@/content/site";

type Props = {
  links: { label: string; href: string; external?: boolean }[];
  compact?: boolean;
};

export default function Footer({ links, compact }: Props) {
  return (
    <footer className={compact ? "footer compact" : "footer"} data-theme="dark">
      <div className="footer-logo">
        <span className="p-mark">p</span>
        <span className="word">oppyns</span>
      </div>
      <div className="footer-links">
        {links.map((l) =>
          l.external ? (
            <a key={l.label} href={l.href} target="_blank" rel="noopener">
              {l.label}
            </a>
          ) : l.href.startsWith("/") ? (
            <Link key={l.label} href={l.href}>
              {l.label}
            </Link>
          ) : (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          )
        )}
      </div>
      <div className="footer-base">
        <span>{site.tagline}</span>
        <span>{site.copyright}</span>
      </div>
    </footer>
  );
}
