import Image from "next/image";
import JobCard from "@/components/jobs/JobCard";
import { JOIN_IMAGE, JOIN_IMAGE_ALT } from "@/lib/about";
import type { BlogPost } from "@/lib/blog";

const SPONTANEOUS_EMAIL = "denis@noah.support";

export default function JobsIndex({
  configured,
  posts,
  error,
}: {
  configured: boolean;
  posts: BlogPost[];
  error: string | null;
}) {
  return (
    <main className="bg-noah-cream">
      <section className="relative flex min-h-[40dvh] flex-col justify-end px-6 pb-8 pt-28 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="font-display text-5xl leading-[1.1] tracking-tight text-noah-ink sm:text-6xl lg:text-7xl">
            Jobs
          </h1>
          <p className="mt-3 max-w-[38ch] font-body text-sm leading-relaxed text-noah-ink-dim sm:text-base">
            Open roles at Noah. Come build this with us.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-6xl">
          {!configured ? (
            <EmptyState
              title="No roles yet"
              body="Open roles will show here once WordPress is connected."
            />
          ) : error && posts.length === 0 ? (
            <EmptyState title="Couldn't load roles" body={error} />
          ) : posts.length === 0 ? (
            <EmptyState
              title="No open roles right now"
              body="Nothing listed at the moment. You can still ask for a spontaneous interview."
            />
          ) : (
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {posts.map((post) => (
                <li key={post.id} className="min-w-0">
                  <JobCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section
        className="relative -mt-px grid min-h-[70vh] grid-cols-1 border-t border-noah-ink-hairline lg:h-[78vh] lg:min-h-0 lg:grid-cols-2"
        aria-labelledby="jobs-spontaneous-heading"
      >
        <div className="flex items-center border-b border-noah-ink-hairline px-6 py-16 sm:px-16 lg:border-b-0 lg:border-r lg:border-noah-ink-hairline">
          <div className="max-w-lg">
            <h2
              id="jobs-spontaneous-heading"
              className="font-display text-4xl leading-tight tracking-tight text-noah-ink sm:text-5xl"
            >
              No role that fits
            </h2>
            <p className="mt-5 max-w-md font-body text-noah-ink-dim sm:text-lg">
              You can always write to Denis for a spontaneous job interview.
            </p>
            <a
              href={`mailto:${SPONTANEOUS_EMAIL}`}
              className="glass glass-pill mt-10 inline-flex h-12 min-w-0 max-w-full items-center justify-center px-6 text-center text-sm font-medium tracking-[0.01em] text-noah-ink transition-colors hover:text-noah-orange active:scale-[0.98] sm:h-14 sm:px-8"
            >
              {SPONTANEOUS_EMAIL}
            </a>
          </div>
        </div>
        <div className="relative min-h-[44vh] overflow-hidden lg:min-h-0">
          <Image
            src={JOIN_IMAGE}
            alt={JOIN_IMAGE_ALT}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>
    </main>
  );
}

function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="py-12">
      <h2 className="font-display text-3xl leading-tight text-noah-ink">{title}</h2>
      <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-noah-ink-dim">
        {body}
      </p>
    </div>
  );
}
