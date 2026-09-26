import { blog } from "@/content/home";
import Icon, { Glyphs } from "@/components/shared/Icon";

export default function Blog() {
  return (
    <section id="blog" className="blog" data-theme="light" data-num="08">
      <div className="mono">{blog.label}</div>
      <div className="blog-grid">
        <h2 data-reveal="" data-rise="">
          {blog.title[0]}
          <br />
          <span className="it">{blog.title[1]}</span>
        </h2>
        <div className="blog-side">
          <span className="blog-ast" aria-hidden>
            <Icon name="asterisk" weight={1.3} />
          </span>
          <p data-reveal="">{blog.sub}</p>
          <a data-reveal="" href={blog.cta.href} className="btn-line">
            <Glyphs text={blog.cta.label} />
          </a>
        </div>
      </div>
    </section>
  );
}
