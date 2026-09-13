import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogGrid } from "@/components/knowledge/BlogCard";
import { formatPostDate } from "@/lib/blog";
import {
  getPostBySlug,
  getPosts,
  getRelatedPosts,
} from "@/lib/wordpress";

export const revalidate = 120;

export async function generateStaticParams() {
  const { posts } = await getPosts({ page: 1, perPage: 50 });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Blog - Noah" };
  return {
    title: `${post.title} - Noah`,
    description: post.excerpt.slice(0, 160) || undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);

  return (
    <main className="bg-noah-cream">
      <article className="px-6 pt-28 pb-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/knowledge/blog"
            className="glass glass-pill mb-8 inline-flex h-12 items-center px-6 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange"
          >
            Back
          </Link>
          <h1 className="mt-2 font-display text-4xl leading-[1.12] tracking-tight text-noah-ink sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <time
              dateTime={post.date}
              className="font-body text-sm text-noah-ink-dim"
            >
              {formatPostDate(post.date)}
            </time>
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="glass glass-pill px-3 py-1.5 font-body text-xs text-noah-ink"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        {post.image && (
          <div className="relative mx-auto mt-12 aspect-[16/9] max-w-5xl overflow-hidden bg-noah-cream-soft">
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="wp-content mx-auto mt-12 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {related.length > 0 && (
        <section className="border-t border-noah-ink-hairline px-6 py-16 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-3xl leading-tight tracking-tight text-noah-ink">
              Keep reading
            </h2>
            <div className="mt-8">
              <BlogGrid posts={related} />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
