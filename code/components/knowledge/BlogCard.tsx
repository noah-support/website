"use client";

import Image from "next/image";
import Link from "next/link";
import GlassPane from "@/components/GlassPane";
import { formatPostDate, type BlogPost } from "@/lib/blog";

export function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.id} className="min-w-0">
          <BlogCard post={post} />
        </li>
      ))}
    </ul>
  );
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/knowledge/blog/${post.slug}`}
      className="group block h-full transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]"
    >
      <GlassPane className="flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden bg-noah-cream-soft">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          ) : (
            <span className="absolute inset-0 bg-noah-navy/8" aria-hidden />
          )}
          {post.tags.length > 0 ? (
            <span className="pointer-events-none absolute right-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap justify-end gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="glass glass-pill glass-orange px-3 py-1 font-body text-[11px] tracking-[0.02em] text-noah-fog"
                >
                  {tag.name}
                </span>
              ))}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col px-5 py-5 sm:px-6">
          <time
            dateTime={post.date}
            className="font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim"
          >
            {formatPostDate(post.date)}
          </time>
          <h2 className="mt-3 font-display text-xl leading-[1.15] tracking-tight text-noah-ink transition-colors duration-200 group-hover:text-noah-orange sm:text-2xl">
            {post.title}
          </h2>
          {post.excerpt ? (
            <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-noah-ink-dim">
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </GlassPane>
    </Link>
  );
}
