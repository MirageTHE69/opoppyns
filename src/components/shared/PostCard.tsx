import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/shared/Icon";
import { blogPage, formatDate, type Post } from "@/content/blog";

/** Article teaser: cover image, meta line, title, excerpt. Used on /blog and the home page. */
export default function PostCard({ post, priority }: { post: Post; priority?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="post-card" data-reveal="">
      <div className="post-cover">
        <Image
          data-plx=""
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          sizes="(max-width: 760px) 100vw, 50vw"
          priority={priority}
        />
      </div>
      <div className="post-meta mono">
        <span>{post.category}</span>
        <span>{formatDate(post.date)}</span>
        <span>{post.readTime}</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <span className="post-more">
        {blogPage.read} <Icon name="arrow-up-right" />
      </span>
    </Link>
  );
}
