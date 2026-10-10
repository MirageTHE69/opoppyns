import Link from "next/link";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";
import ScrollEffects from "@/components/shared/ScrollEffects";
import Icon from "@/components/shared/Icon";
import { pageCta } from "@/content/blog";
import { site } from "@/content/site";

// Same "heavy" motion settings as the home page.
const MOTION = { reveal: 1.8, fx: 1.7 };

type Props = {
  /** nav link key to highlight */
  active?: string;
  children: React.ReactNode;
};

/** Frame for inner pages: nav, scroll motion, closing CTA band and footer. */
export default function PageShell({ active, children }: Props) {
  return (
    <div
      className="root"
      style={
        {
          "--reveal-d": `${26 * MOTION.reveal}px`,
          "--rise-d": `${34 * MOTION.fx}px`,
        } as React.CSSProperties
      }
    >
      <ScrollEffects progress parallax k={MOTION.fx} />
      <Nav active={active} talkHref={pageCta.href} />
      {children}

      <section className="cta-band" data-theme="red">
        <h2 data-rise="">
          {pageCta.title[0]} <span className="it">{pageCta.title[1]}</span>
        </h2>
        <Link href={pageCta.href} className="pill connect">
          {pageCta.button} <Icon name="arrow-up-right" />
        </Link>
        <span className="cta-ast" aria-hidden>
          <Icon name="asterisk" weight={1.1} />
        </span>
      </section>

      <Footer
        links={[
          { label: "Home ↗", href: "/" },
          { label: `${site.email} ↗`, href: `mailto:${site.email}` },
          { label: "Instagram ↗", href: site.instagram, external: true },
        ]}
      />
    </div>
  );
}
