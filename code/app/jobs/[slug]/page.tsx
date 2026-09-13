import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug, getJobPosts } from "@/lib/wordpress";

export const revalidate = 120;

export async function generateStaticParams() {
  const { posts } = await getJobPosts({ page: 1, perPage: 50 });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getJobBySlug(slug);
  if (!post) return { title: "Jobs — Noah" };
  return {
    title: `${post.title} — Noah`,
    description: post.excerpt.slice(0, 160) || undefined,
  };
}

export default async function JobPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getJobBySlug(slug);
  if (!post) notFound();

  return (
    <main className="bg-noah-cream">
      <article className="px-6 pt-28 pb-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/jobs"
            className="glass glass-pill mb-8 inline-flex h-12 items-center px-6 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange"
          >
            Back
          </Link>
          <h1 className="mt-2 font-display text-4xl leading-[1.12] tracking-tight text-noah-ink sm:text-5xl">
            {post.title}
          </h1>
        </div>

        <div
          className="wp-content mx-auto mt-12 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
