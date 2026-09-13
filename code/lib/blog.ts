export const BLOG_PER_PAGE = 8;

export type BlogTag = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string | null;
  imageAlt: string;
  tags: BlogTag[];
};

export type PostsResult = {
  configured: boolean;
  posts: BlogPost[];
  totalPages: number;
  total: number;
  error: string | null;
};

export function formatPostDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
