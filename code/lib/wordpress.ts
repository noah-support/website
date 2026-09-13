import {
  BLOG_PER_PAGE,
  type BlogPost,
  type BlogTag,
  type PostsResult,
} from "@/lib/blog";

const REVALIDATE = 120;
const JOBS_PER_PAGE = 50;
const EXCLUDED_TAG_SLUGS = new Set(["job"]);

function isExcludedTag(term: { slug: string; name?: string }) {
  const slug = term.slug.toLowerCase();
  const name = stripHtml(term.name ?? "").toLowerCase();
  return EXCLUDED_TAG_SLUGS.has(slug) || EXCLUDED_TAG_SLUGS.has(name);
}

export type { BlogPost, BlogTag, PostsResult };

type WpRendered = { rendered?: string };

type WpMedia = {
  source_url?: string;
  alt_text?: string;
  media_details?: {
    sizes?: Record<string, { source_url?: string }>;
  };
};

type WpTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy?: string;
  count?: number;
};

type WpPost = {
  id: number;
  slug: string;
  date: string;
  title?: WpRendered;
  excerpt?: WpRendered;
  content?: WpRendered;
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WpTerm[][];
  };
};

type WpSearchHit = {
  id: number | string;
  title?: string;
  type?: string;
  subtype?: string;
};

function getOrigin() {
  const raw = process.env.WORDPRESS_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

export function isWordpressConfigured() {
  return Boolean(getOrigin());
}

export function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(parseInt(n, 16))
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function featuredImage(post: WpPost) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return { image: null, imageAlt: "" };
  const sizes = media.media_details?.sizes ?? {};
  const image =
    sizes.medium_large?.source_url ||
    sizes.large?.source_url ||
    media.source_url ||
    null;
  return { image, imageAlt: media.alt_text ?? "" };
}

function mapTags(post: WpPost): BlogTag[] {
  const groups = post._embedded?.["wp:term"] ?? [];
  return groups
    .flat()
    .filter((term) => term.taxonomy === "post_tag" && !isExcludedTag(term))
    .map((term) => ({
      id: term.id,
      name: stripHtml(term.name),
      slug: term.slug,
      count: term.count ?? 0,
    }));
}

function mapPost(post: WpPost): BlogPost {
  const { image, imageAlt } = featuredImage(post);
  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title?.rendered ?? ""),
    excerpt: stripHtml(post.excerpt?.rendered ?? ""),
    content: post.content?.rendered ?? "",
    date: post.date,
    image,
    imageAlt,
    tags: mapTags(post),
  };
}

function postHasJobTag(post: WpPost) {
  const groups = post._embedded?.["wp:term"] ?? [];
  return groups.flat().some((term) => isExcludedTag(term));
}

function mapJobPost(post: WpPost): BlogPost {
  return {
    ...mapPost(post),
    image: null,
    imageAlt: "",
  };
}

async function wpGet(path: string, cache: "revalidate" | "no-store" = "revalidate") {
  const origin = getOrigin();
  if (!origin) {
    return {
      configured: false as const,
      ok: false as const,
      status: 0,
      json: null,
      totalPages: 0,
      total: 0,
      error: null,
    };
  }

  try {
    const response = await fetch(`${origin}${path}`, {
      headers: { Accept: "application/json" },
      ...(cache === "no-store"
        ? { cache: "no-store" as const }
        : { next: { revalidate: REVALIDATE } }),
    });
    const totalPages = Number(response.headers.get("X-WP-TotalPages") ?? "0");
    const total = Number(response.headers.get("X-WP-Total") ?? "0");
    if (!response.ok) {
      return {
        configured: true as const,
        ok: false as const,
        status: response.status,
        json: null,
        totalPages: 0,
        total: 0,
        error: `WordPress responded with ${response.status}.`,
      };
    }
    const json: unknown = await response.json();
    return {
      configured: true as const,
      ok: true as const,
      status: response.status,
      json,
      totalPages,
      total,
      error: null,
    };
  } catch {
    return {
      configured: true as const,
      ok: false as const,
      status: 0,
      json: null,
      totalPages: 0,
      total: 0,
      error: "Couldn't reach WordPress.",
    };
  }
}

async function getExcludedTagIds() {
  const slugs = [...EXCLUDED_TAG_SLUGS];
  if (slugs.length === 0) return [];
  const params = new URLSearchParams({
    per_page: "20",
    slug: slugs.join(","),
  });
  const result = await wpGet(`/wp-json/wp/v2/tags?${params.toString()}`);
  if (!result.ok || !Array.isArray(result.json)) return [];
  return (result.json as WpTerm[])
    .filter((term) => isExcludedTag(term))
    .map((term) => term.id);
}

function titleContains(title: string, query: string) {
  return stripHtml(title).toLowerCase().includes(query.trim().toLowerCase());
}

function mapListedPosts(raw: WpPost[]) {
  return raw
    .filter((post) => {
      const groups = post._embedded?.["wp:term"] ?? [];
      return !groups.flat().some((term) => isExcludedTag(term));
    })
    .map(mapPost);
}

function orderPosts(posts: BlogPost[], ids: number[]) {
  const byId = new Map(posts.map((post) => [post.id, post]));
  return ids.flatMap((id) => {
    const post = byId.get(id);
    return post ? [post] : [];
  });
}

function emptyResult(configured: boolean, error: string | null = null): PostsResult {
  return { configured, posts: [], totalPages: 0, total: 0, error };
}

async function fetchPostsByIds(
  ids: number[],
  {
    tagIds = [],
    exclude = [],
  }: {
    tagIds?: number[];
    exclude?: number[];
  } = {}
) {
  if (ids.length === 0) return emptyResult(true);

  const params = new URLSearchParams({
    _embed: "1",
    include: ids.join(","),
    per_page: String(ids.length),
    status: "publish",
  });
  if (tagIds.length) params.set("tags", tagIds.join(","));
  if (exclude.length) params.set("exclude", exclude.join(","));
  const excludedTagIds = await getExcludedTagIds();
  if (excludedTagIds.length) {
    params.set("tags_exclude", excludedTagIds.join(","));
  }

  const result = await wpGet(`/wp-json/wp/v2/posts?${params.toString()}`, "no-store");
  if (!result.configured) return emptyResult(false);
  if (!result.ok || !Array.isArray(result.json)) {
    return emptyResult(true, result.error ?? "Couldn't load posts.");
  }

  return {
    configured: true,
    posts: orderPosts(mapListedPosts(result.json as WpPost[]), ids),
    totalPages: 1,
    total: ids.length,
    error: null,
  };
}

async function searchTitleMatchIds(query: string) {
  const ids: number[] = [];
  const seen = new Set<number>();
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= 5) {
    const params = new URLSearchParams({
      search: query,
      type: "post",
      subtype: "post",
      per_page: "100",
      page: String(page),
    });
    const result = await wpGet(
      `/wp-json/wp/v2/search?${params.toString()}`,
      "no-store"
    );
    if (!result.configured) {
      return { configured: false as const, ok: false as const, ids: [], error: null };
    }
    if (!result.ok || !Array.isArray(result.json)) {
      return {
        configured: true as const,
        ok: false as const,
        ids: [],
        error: result.error ?? "Couldn't load posts.",
      };
    }

    totalPages = Math.max(1, result.totalPages || 1);
    for (const hit of result.json as WpSearchHit[]) {
      if (hit.type && hit.type !== "post") continue;
      if (hit.subtype && hit.subtype !== "post") continue;
      const id = Number(hit.id);
      if (!Number.isFinite(id) || id <= 0 || seen.has(id)) continue;
      if (!titleContains(String(hit.title ?? ""), query)) continue;
      seen.add(id);
      ids.push(id);
    }
    page += 1;
  }

  return { configured: true as const, ok: true as const, ids, error: null };
}

export async function getPosts({
  page = 1,
  perPage = BLOG_PER_PAGE,
  search = "",
  tagIds = [],
  exclude = [],
}: {
  page?: number;
  perPage?: number;
  search?: string;
  tagIds?: number[];
  exclude?: number[];
} = {}): Promise<PostsResult> {
  const query = search.trim();
  if (query) {
    const found = await searchTitleMatchIds(query);
    if (!found.configured) return emptyResult(false);
    if (!found.ok) return emptyResult(true, found.error ?? "Couldn't load posts.");

    let listed = await fetchPostsByIds(found.ids, { tagIds, exclude });
    if (!listed.configured || listed.error) return listed;

    if (listed.posts.length === 0) {
      listed = await getPosts({ page: 1, perPage: 100, tagIds, exclude });
      if (!listed.configured || listed.error) return listed;
      listed = {
        ...listed,
        posts: listed.posts.filter((post) => titleContains(post.title, query)),
      };
    }

    const start = (Math.max(1, page) - 1) * perPage;
    const paged = listed.posts.slice(start, start + perPage);
    return {
      configured: true,
      posts: paged,
      totalPages: Math.ceil(listed.posts.length / perPage),
      total: listed.posts.length,
      error: null,
    };
  }

  const params = new URLSearchParams({
    _embed: "1",
    per_page: String(perPage),
    page: String(Math.max(1, page)),
    status: "publish",
  });
  if (tagIds.length) params.set("tags", tagIds.join(","));
  if (exclude.length) params.set("exclude", exclude.join(","));
  const excludedTagIds = await getExcludedTagIds();
  if (excludedTagIds.length) {
    params.set("tags_exclude", excludedTagIds.join(","));
  }

  const result = await wpGet(`/wp-json/wp/v2/posts?${params.toString()}`);
  if (!result.configured) return emptyResult(false);
  if (!result.ok || !Array.isArray(result.json)) {
    return emptyResult(true, result.error ?? "Couldn't load posts.");
  }

  return {
    configured: true,
    posts: mapListedPosts(result.json as WpPost[]),
    totalPages: result.totalPages,
    total: result.total,
    error: null,
  };
}

export async function getTags(): Promise<BlogTag[]> {
  const result = await wpGet(
    "/wp-json/wp/v2/tags?per_page=50&orderby=count&order=desc&hide_empty=true"
  );
  if (!result.ok || !Array.isArray(result.json)) return [];
  return (result.json as WpTerm[])
    .filter((term) => !isExcludedTag(term))
    .map((term) => ({
      id: term.id,
      name: stripHtml(term.name),
      slug: term.slug,
      count: term.count ?? 0,
    }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const params = new URLSearchParams({
    _embed: "1",
    slug,
    status: "publish",
  });
  const result = await wpGet(`/wp-json/wp/v2/posts?${params.toString()}`);
  if (!result.ok || !Array.isArray(result.json) || result.json.length === 0) {
    return null;
  }
  const raw = (result.json as WpPost[])[0];
  const groups = raw._embedded?.["wp:term"] ?? [];
  if (groups.flat().some((term) => isExcludedTag(term))) return null;
  return mapPost(raw);
}

export async function getJobPosts({
  page = 1,
  perPage = JOBS_PER_PAGE,
}: {
  page?: number;
  perPage?: number;
} = {}): Promise<PostsResult> {
  if (!isWordpressConfigured()) return emptyResult(false);

  const jobTagIds = await getExcludedTagIds();
  if (jobTagIds.length === 0) return emptyResult(true);

  const params = new URLSearchParams({
    _embed: "1",
    per_page: String(perPage),
    page: String(Math.max(1, page)),
    status: "publish",
    tags: jobTagIds.join(","),
  });

  const result = await wpGet(`/wp-json/wp/v2/posts?${params.toString()}`);
  if (!result.configured) return emptyResult(false);
  if (!result.ok || !Array.isArray(result.json)) {
    return emptyResult(true, result.error ?? "Couldn't load roles.");
  }

  const posts = (result.json as WpPost[])
    .filter(postHasJobTag)
    .map(mapJobPost);

  return {
    configured: true,
    posts,
    totalPages: result.totalPages,
    total: result.total,
    error: null,
  };
}

export async function getJobBySlug(slug: string): Promise<BlogPost | null> {
  const params = new URLSearchParams({
    _embed: "1",
    slug,
    status: "publish",
  });
  const result = await wpGet(`/wp-json/wp/v2/posts?${params.toString()}`);
  if (!result.ok || !Array.isArray(result.json) || result.json.length === 0) {
    return null;
  }
  const raw = (result.json as WpPost[])[0];
  if (!postHasJobTag(raw)) return null;
  return mapJobPost(raw);
}

export async function getRelatedPosts(post: BlogPost, limit = 3) {
  const tagId = post.tags[0]?.id;
  const collected: BlogPost[] = [];
  const seen = new Set<number>([post.id]);

  if (tagId) {
    const tagged = await getPosts({
      page: 1,
      perPage: limit + 1,
      tagIds: [tagId],
      exclude: [post.id],
    });
    for (const item of tagged.posts) {
      if (collected.length >= limit) break;
      if (seen.has(item.id)) continue;
      collected.push(item);
      seen.add(item.id);
    }
  }

  if (collected.length < limit) {
    const latest = await getPosts({
      page: 1,
      perPage: limit + 4,
      exclude: [post.id],
    });
    for (const item of latest.posts) {
      if (collected.length >= limit) break;
      if (seen.has(item.id)) continue;
      collected.push(item);
      seen.add(item.id);
    }
  }

  return collected;
}
