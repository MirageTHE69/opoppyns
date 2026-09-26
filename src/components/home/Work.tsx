import Image from "next/image";
import { work } from "@/content/home";
import Icon, { Glyphs } from "@/components/shared/Icon";

export default function Work() {
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
        {work.projects.map((p, i) => (
          <a key={p.src} href={work.cta.href} data-reveal="" className={`work-tile t${i + 1}`}>
            <div className="photo">
              <Image data-plx="" src={p.src} alt={p.alt} fill sizes="(max-width: 760px) 100vw, 60vw" />
            </div>
            <div className="work-cap mono">
              <span>{String(i + 1).padStart(2, "0")}</span>
              {p.title ? <span className="work-title">{p.title}</span> : null}
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
