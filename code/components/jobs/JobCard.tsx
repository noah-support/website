import Link from "next/link";
import GlassPane from "@/components/GlassPane";
import type { BlogPost } from "@/lib/blog";

export default function JobCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/jobs/${post.slug}`}
      className="group block h-full min-w-0 transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]"
    >
      <GlassPane className="flex h-full flex-col px-5 py-6 sm:px-6 sm:py-7">
        <h2 className="font-display text-xl leading-[1.15] tracking-tight text-noah-ink transition-colors duration-200 group-hover:text-noah-orange sm:text-2xl">
          {post.title}
        </h2>
        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-noah-ink-dim">
            {post.excerpt}
          </p>
        ) : null}
      </GlassPane>
    </Link>
  );
}
