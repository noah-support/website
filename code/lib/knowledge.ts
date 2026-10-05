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
    poster: "/industries/blog.jpg",
    video: "/industries/blog.avif",
  },
  {
    slug: "documentation",
    name: "Documentation",
    poster: "/industries/documentation.jpg",
    video: "/industries/documentation.avif",
    comingSoon: true,
  },
];
