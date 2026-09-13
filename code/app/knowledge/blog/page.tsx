import BlogIndex from "@/components/knowledge/BlogIndex";
import { getPosts, getTags, isWordpressConfigured } from "@/lib/wordpress";

export const revalidate = 120;

export const metadata = {
  title: "Blog — Noah",
};

export default async function BlogListingPage() {
  const configured = isWordpressConfigured();
  const [postsResult, tags] = await Promise.all([
    getPosts({ page: 1 }),
    getTags(),
  ]);

  return (
    <BlogIndex
      configured={configured}
      initialPosts={postsResult.posts}
      initialTotalPages={postsResult.totalPages}
      initialError={postsResult.error}
      tags={tags}
    />
  );
}
