"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { BlogGrid } from "@/components/knowledge/BlogCard";
import {
  type BlogPost,
  type BlogTag,
  type PostsResult,
} from "@/lib/blog";

type BlogIndexProps = {
  configured: boolean;
  initialPosts: BlogPost[];
  initialTotalPages: number;
  initialError: string | null;
  tags: BlogTag[];
};

export default function BlogIndex({
  configured,
  initialPosts,
  initialTotalPages,
  initialError,
  tags,
}: BlogIndexProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestSeq = useRef(0);
  const didMount = useRef(false);

  const selectedKey = selectedTags.join(",");
  const query = search.trim();
  const visiblePosts = query
    ? posts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase())
      )
    : posts;
  const hasMore = page < totalPages;
  const filtering = query.length > 0 || selectedTags.length > 0;

  const fetchPage = useCallback(
    async (nextPage: number, replace: boolean) => {
      if (replace) abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const ticket = ++requestSeq.current;
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(nextPage) });
        if (search.trim()) params.set("search", search.trim());
        if (selectedTags.length) params.set("tags", selectedTags.join(","));
        const response = await fetch(`/api/blog?${params.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = (await response.json()) as PostsResult;
        if (ticket !== requestSeq.current || controller.signal.aborted) return;
        if (!response.ok || data.error) {
          setError(data.error ?? "Couldn't load posts.");
          if (replace) setPosts([]);
          return;
        }
        setPosts((current) => (replace ? data.posts : [...current, ...data.posts]));
        setPage(nextPage);
        setTotalPages(data.totalPages);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        setError("Couldn't load posts.");
        if (replace) setPosts([]);
      } finally {
        if (!controller.signal.aborted && ticket === requestSeq.current) {
          setLoading(false);
        }
      }
    },
    [search, selectedTags]
  );

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (!configured) return;
    setLoading(true);
    const handle = window.setTimeout(() => {
      void fetchPage(1, true);
    }, 280);
    return () => window.clearTimeout(handle);
  }, [configured, fetchPage, search, selectedKey]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading || !configured || filtering) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void fetchPage(page + 1, false);
      },
      { rootMargin: "480px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [configured, fetchPage, filtering, hasMore, loading, page]);

  function toggleTag(id: number) {
    setSelectedTags((current) =>
      current.includes(id) ? current.filter((tag) => tag !== id) : [...current, id]
    );
  }

  return (
    <main className="bg-noah-cream">
      <section className="relative flex min-h-[50dvh] flex-col justify-end px-6 pb-8 pt-28 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="font-display text-5xl leading-[1.1] tracking-tight text-noah-ink sm:text-6xl lg:text-7xl">
            Blog
          </h1>
          <p className="mt-3 max-w-[38ch] font-body text-sm leading-relaxed text-noah-ink-dim sm:text-base">
            Notes from interviewing, mapping, and shipping inside one department.
          </p>
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="sr-only" htmlFor="blog-search">
              Search posts
            </label>
            <div className="glass glass-pill flex h-12 w-full shrink-0 items-center px-5 sm:w-[min(100%,20rem)]">
              <input
                id="blog-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search posts"
                autoComplete="off"
                className="h-full w-full appearance-none bg-transparent font-body text-sm text-noah-ink outline-none placeholder:text-noah-ink-faint"
              />
            </div>
            {tags.length > 0 && (
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                {tags.map((tag) => {
                  const selected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleTag(tag.id)}
                      className={`glass glass-pill px-4 py-2 font-body text-xs tracking-[0.01em] transition-[transform,background,border-color] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
                        selected
                          ? "glass-orange text-noah-fog"
                          : "text-noah-ink hover:text-noah-orange"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            )}
          </form>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-6xl">
          {!configured ? (
            <EmptyState
              title="No posts yet"
              body="Blog posts will show here once WordPress is connected."
            />
          ) : error && visiblePosts.length === 0 ? (
            <EmptyState
              title="Couldn't load posts"
              body={error}
              action={
                <button
                  type="button"
                  onClick={() => void fetchPage(1, true)}
                  className="glass glass-pill mt-4 flex h-12 items-center px-6 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange"
                >
                  Try again
                </button>
              }
            />
          ) : visiblePosts.length === 0 && !loading ? (
            <EmptyState
              title={filtering ? "Nothing matches" : "No posts yet"}
              body={
                filtering
                  ? "Try another search or clear a tag."
                  : "There are no published posts in WordPress yet."
              }
            />
          ) : (
            <BlogGrid posts={visiblePosts} />
          )}

          {loading && (
            <p className="py-10 font-body text-sm text-noah-ink-dim">Loading</p>
          )}

          {configured && hasMore && !error && (
            <div className="flex flex-col items-start gap-4 pt-6">
              <div ref={sentinelRef} aria-hidden className="h-px w-full" />
              <button
                type="button"
                onClick={() => void fetchPage(page + 1, false)}
                disabled={loading}
                className="glass glass-pill flex h-12 items-center px-6 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange disabled:opacity-60"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="py-12">
      <h2 className="font-display text-3xl leading-tight text-noah-ink">{title}</h2>
      <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-noah-ink-dim">
        {body}
      </p>
      {action}
    </div>
  );
}
