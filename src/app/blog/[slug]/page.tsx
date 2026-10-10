import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/shared/PageShell";
import PostCard from "@/components/shared/PostCard";
import Icon, { Glyphs } from "@/components/shared/Icon";
import { blogPage, formatDate, getPost, posts, type Block } from "@/content/blog";

type Params = { params: Promise<{ slug: string }> };

// Only the posts listed in content/blog.ts exist.
export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} — Poppyns Communications`, description: post.excerpt };
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case "h2":
      return <h2 key={i}>{b.text}</h2>;
    case "quote":
      return (
        <blockquote key={i} data-reveal="">
          <Icon name="asterisk" />
          {b.text}
        </blockquote>
      );
    case "list":
      return (
        <ul key={i}>
          {b.items.map((it) => (
            <li key={it}>
              <Icon name="asterisk" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return <p key={i}>{b.text}</p>;
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const idx = posts.indexOf(post);
  const next = posts.length > 1 ? posts[(idx + 1) % posts.length] : null;

  return (
    <PageShell active="blog">
      <article>
        <header id="top" className="art-hero" data-theme="light">
          <div className="sv-blob" />
          <div className="sv-crumbs mono" data-reveal="">
            <Link href="/blog">
              <Glyphs text={blogPage.back} />
            </Link>
            <span>
              {post.category} · {formatDate(post.date)} · {post.readTime}
            </span>
          </div>
          <h1 data-rise="">{post.title}</h1>
          <p className="art-lede" data-reveal="">
            {post.excerpt}
          </p>
        </header>

        <div className="art-cover-wrap" data-theme="light">
          <div className="art-cover" data-reveal="">
            <Image data-plx="" src={post.cover.src} alt={post.cover.alt} fill sizes="100vw" priority />
          </div>
        </div>

        <div className="art-body-wrap" data-theme="light">
          <aside className="art-aside mono">
            <span>{blogPage.by}</span>
            <span>{formatDate(post.date)}</span>
          </aside>
          <div className="art-body">{post.body.map(renderBlock)}</div>
        </div>
      </article>

      {next && (
        <section className="art-next" data-theme="dark">
          <div className="mono" data-reveal="">
            {blogPage.nextLabel}
          </div>
          <PostCard post={next} />
        </section>
      )}
    </PageShell>
  );
}
