import { blog } from "@/content/home";
import Link from "next/link";
import Icon, { Glyphs } from "@/components/shared/Icon";
import PostCard from "@/components/shared/PostCard";
import { posts } from "@/content/blog";

export default function Blog({ posts: dynamicPosts }: { posts?: typeof posts } = {}) {
  const displayPosts = dynamicPosts && dynamicPosts.length > 0 ? dynamicPosts : posts;

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
          <Link data-reveal="" href={blog.cta.href} className="btn-line">
            <Glyphs text={blog.cta.label} />
          </Link>
        </div>
      </div>
      <div className="blog-posts">
        {displayPosts.slice(0, 2).map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}
