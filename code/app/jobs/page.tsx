import JobsIndex from "@/components/jobs/JobsIndex";
import { getJobPosts, isWordpressConfigured } from "@/lib/wordpress";

export const revalidate = 120;

export const metadata = {
  title: "Jobs — Noah",
  description: "Open roles at Noah.",
};

export default async function JobsPage() {
  const configured = isWordpressConfigured();
  const result = await getJobPosts();

  return (
    <JobsIndex
      configured={configured}
      posts={result.posts}
      error={result.error}
    />
  );
}
