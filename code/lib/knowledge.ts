export type KnowledgeItem = {
  slug: string;
  name: string;
  href?: string;
  poster: string;
  video: string;
  comingSoon?: boolean;
};

export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    slug: "blog",
    name: "Blog",
    href: "/knowledge/blog",
    poster: "/knowledge/blog.jpg",
    video: "/knowledge/blog.avif",
  },
  {
    slug: "documentation",
    name: "Documentation",
    poster: "/knowledge/prerequisites.jpg",
    video: "/knowledge/prerequisites.avif",
    comingSoon: true,
  },
];
