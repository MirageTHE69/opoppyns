import Image from "next/image";
import { work } from "@/content/home";
import Icon, { Glyphs } from "@/components/shared/Icon";

export type WorkItem = {
  id?: string;
  src: string;
  alt: string;
  title?: string;
  category?: string;
  link?: string;
};

export default function Work({ projects: customProjects }: { projects?: WorkItem[] } = {}) {
  const items = customProjects && customProjects.length > 0 ? customProjects : work.projects;

  return (
    <section id="work" className="work" data-theme="dark" data-num="07">
      <div className="work-head">
        <div className="mono">{work.label}</div>
        <div>
          <h2 data-reveal="" data-rise="">
            {work.title[0]} <span className="it">{work.title[1]}</span>
          </h2>
          <p data-reveal="">{work.sub}</p>
        </div>
      </div>

      <div className="work-grid">
        {items.map((p, i) => (
          <a key={p.id || p.src + i} href={p.link || work.cta.href} data-reveal="" className={`work-tile t${(i % 4) + 1}`}>
            <div className="photo">
              <Image data-plx="" src={p.src} alt={p.alt || p.title || "Project"} fill sizes="(max-width: 760px) 100vw, 60vw" />
            </div>
            <div className="work-cap mono">
              <span>{String(i + 1).padStart(2, "0")}</span>
              {p.title ? <span className="work-title">{p.title}</span> : null}
              {p.category ? <span className="work-cat" style={{ opacity: 0.7, fontSize: "0.85em" }}>({p.category})</span> : null}
              <span className="work-arrow"><Icon name="arrow-up-right" /></span>
            </div>
          </a>
        ))}
      </div>

      <div className="work-foot">
        <a data-reveal="" href={work.cta.href} className="btn-line">
          <Glyphs text={work.cta.label} />
        </a>
      </div>
    </section>
  );
}
