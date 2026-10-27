import type { Metadata } from "next";
import PageShell from "@/components/shared/PageShell";
import PostCard from "@/components/shared/PostCard";
import { blogPage } from "@/content/blog";
import { getPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Poppyns Communications",
  description: blogPage.sub,
};

export default async function BlogIndexPage() {
  const posts = await getPosts();
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <PageShell active="blog">
      <section id="top" className="bl-hero" data-theme="light">
        <div className="sv-blob" />
        <div className="mono" data-reveal="">
          {blogPage.label} / {String(sorted.length).padStart(2, "0")} ARTICLES
        </div>
        <h1 data-rise="">
          {blogPage.title[0]}
          <br />
          <span className="it">{blogPage.title[1]}</span>
        </h1>
        <p data-reveal="">{blogPage.sub}</p>
      </section>

      <section className="bl-list" data-theme="light">
        {sorted.map((p, i) => (
          <PostCard key={p.slug} post={p} priority={i === 0} />
        ))}
      </section>
    </PageShell>
  );
}
