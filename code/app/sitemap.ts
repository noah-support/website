import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/company";
import { INDUSTRIES } from "@/lib/industries";
import type { BlogPost } from "@/lib/blog";
import { getJobPosts, getPosts } from "@/lib/wordpress";

export const revalidate = 120;

const PAGE_SIZE = 100;

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/why-noah", priority: 0.7, changeFrequency: "monthly" },
  { path: "/trade", priority: 0.7, changeFrequency: "monthly" },
  { path: "/industry", priority: 0.7, changeFrequency: "monthly" },
  { path: "/knowledge", priority: 0.7, changeFrequency: "weekly" },
  { path: "/knowledge/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/knowledge/prerequisites", priority: 0.6, changeFrequency: "monthly" },
  { path: "/jobs", priority: 0.6, changeFrequency: "weekly" },
  { path: "/documentation", priority: 0.6, changeFrequency: "monthly" },
  { path: "/book", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

function absolute(path: string) {
  if (path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function route(
  path: string,
  priority: number,
  changeFrequency: ChangeFrequency,
  lastModified?: Date
): MetadataRoute.Sitemap[number] {
  return {
    url: absolute(path),
    priority,
    changeFrequency,
    ...(lastModified ? { lastModified } : {}),
  };
}

async function everyPage(
  load: (page: number) => Promise<{
    configured: boolean;
    posts: BlogPost[];
    totalPages: number;
    error: string | null;
  }>
) {
  const first = await load(1);
  if (!first.configured || first.error) return [];

  const posts = [...first.posts];
  const totalPages = Math.max(first.totalPages, 1);
  for (let page = 2; page <= totalPages; page += 1) {
    const next = await load(page);
    if (!next.configured || next.error) break;
    posts.push(...next.posts);
  }
  return posts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, jobs] = await Promise.all([
    everyPage((page) => getPosts({ page, perPage: PAGE_SIZE })),
    everyPage((page) => getJobPosts({ page, perPage: PAGE_SIZE })),
  ]);

  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  function add(entry: MetadataRoute.Sitemap[number]) {
    if (seen.has(entry.url)) return;
    seen.add(entry.url);
    entries.push(entry);
  }

  for (const item of STATIC_ROUTES) {
    add(route(item.path, item.priority, item.changeFrequency));
  }

  for (const industry of INDUSTRIES) {
    add(route(`/industry/${industry.slug}`, 0.7, "monthly"));
  }

  for (const post of articles) {
    const lastModified = new Date(post.date);
    add(
      route(
        `/knowledge/blog/${encodeURIComponent(post.slug)}`,
        0.8,
        "weekly",
        Number.isNaN(lastModified.getTime()) ? undefined : lastModified
      )
    );
  }

  for (const post of jobs) {
    const lastModified = new Date(post.date);
    add(
      route(
        `/jobs/${encodeURIComponent(post.slug)}`,
        0.6,
        "weekly",
        Number.isNaN(lastModified.getTime()) ? undefined : lastModified
      )
    );
  }

  return entries;
}
