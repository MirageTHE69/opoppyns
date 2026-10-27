import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/shared/PageShell";
import Icon, { Glyphs } from "@/components/shared/Icon";
import { servicePage } from "@/content/services";
import { getService, getServices } from "@/lib/data";

type Params = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const generateStaticParams = async () => {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return { title: `${service.title} — Poppyns Communications`, description: service.intro };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const services = await getServices();
  const index = services.findIndex((s) => s.slug === service.slug);
  const num = String((index >= 0 ? index : 0) + 1).padStart(2, "0");
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <PageShell active="services">
      <section id="top" className="sv-hero" data-theme="light">
        <div className="sv-blob" />
        <div className="sv-crumbs mono" data-reveal="">
          <Link href="/#services">
            <Glyphs text={servicePage.back} />
          </Link>
          <span>
            {servicePage.crumb} / {num}
          </span>
        </div>
        <h1 data-rise="">
          {service.title}
          <span className="red">.</span>
        </h1>
        <div className="sv-hero-row">
          <p className="sv-tagline" data-reveal="">
            {service.tagline}
          </p>
          <p className="sv-intro" data-reveal="">
            {service.intro}
          </p>
        </div>
      </section>

      <section className="sv-inside" data-theme="dark">
        <div className="mono" data-reveal="">
          {servicePage.insideLabel}
        </div>
        <ol className="sv-items">
          {service.items.map((it, i) => (
            <li key={it.name} data-reveal="">
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <h2>{it.name}</h2>
              <p>{it.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="sv-steps" data-theme="light">
        <div className="mono" data-reveal="">
          {servicePage.stepsLabel}
        </div>
        <div className="sv-steps-grid">
          {service.steps.map((st, i) => (
            <div key={st.title} data-reveal="" className="sv-step">
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{st.title}</h3>
              <p>{st.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sv-others" data-theme="dark">
        <div className="mono" data-reveal="">
          {servicePage.othersLabel}
        </div>
        <div className="sv-others-list">
          {others.map((o) => (
            <Link key={o.slug} href={`/services/${o.slug}`} data-reveal="">
              <span className="n">{String(services.indexOf(o) + 1).padStart(2, "0")}</span>
              <span className="t">{o.title}</span>
              <span className="tag">{o.tagline}</span>
              <Icon name="arrow-up-right" />
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
