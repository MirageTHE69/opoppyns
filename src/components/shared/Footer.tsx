import Link from "next/link";
import { site } from "@/content/site";
import { Glyphs } from "@/components/shared/Icon";
import Logo from "@/components/shared/Logo";

type Props = {
  links: { label: string; href: string; external?: boolean }[];
  compact?: boolean;
};

export default function Footer({ links, compact }: Props) {
  return (
    <footer className={compact ? "footer compact" : "footer"} data-theme="dark">
      <a href="#top" className="footer-logo" aria-label="Back to top">
        <Logo tone="light" />
      </a>
      <div className="footer-links">
        {links.map((l) =>
          l.external ? (
            <a key={l.label} href={l.href} target="_blank" rel="noopener">
              <Glyphs text={l.label} />
            </a>
          ) : l.href.startsWith("/") ? (
            <Link key={l.label} href={l.href}>
              <Glyphs text={l.label} />
            </Link>
          ) : (
            <a key={l.label} href={l.href}>
              <Glyphs text={l.label} />
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
