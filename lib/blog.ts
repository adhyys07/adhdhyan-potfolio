import fs from "node:fs";
import path from "node:path";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  featured: boolean;
  content: string;
};

export type BlogPostInput = {
  slug?: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  tags: string[];
  featured: boolean;
  content: string;
};

const POSTS_FILE_PATH = path.join(process.cwd(), "data", "posts.json");

const defaultPosts: BlogPost[] = [
  {
    slug: "designing-a-blog-system",
    title: "Designing a blog system that stays simple to maintain",
    excerpt:
      "A practical first pass at structuring articles so the site can grow without becoming hard to edit.",
    category: "System design",
    publishedAt: "2026-04-18",
    readingTime: "5 min read",
    tags: ["next.js", "content model", "portfolio"],
    featured: true,
    content:
      "## Start with one source of truth\n\nA blog becomes difficult to extend when post data is scattered across components. Keeping the content in a single module makes the routes, cards, and metadata all derive from the same shape.\n\nThat approach is intentionally boring, but it keeps the system predictable while the rest of the site is still changing.\n\n## Design for the next content step\n\nThe current implementation is static, but the shape already works for markdown, a CMS, or API-backed content later. That means the visual system can stay stable while the content source evolves.",
  },
  {
    slug: "writing-case-studies-that-read-fast",
    title: "Writing case studies that still read quickly on mobile",
    excerpt:
      "A layout pattern for turning longer write-ups into something scannable without losing depth.",
    category: "Writing",
    publishedAt: "2026-04-10",
    readingTime: "4 min read",
    tags: ["editing", "layout", "ux"],
    featured: true,
    content:
      "## Lead with the outcome\n\nMobile readers need the conclusion before the context. The strongest page structure opens with a clear claim, then uses short sections to explain the decisions behind it.\n\n## Use rhythm instead of density\n\nAlternating headings, pull quotes, and short paragraphs creates a pace that feels lighter than a single long wall of text.",
  },
  {
    slug: "what-to-track-in-a-portfolio-blog",
    title: "What to track in a portfolio blog after launch",
    excerpt:
      "A lightweight checklist for understanding which posts and sections actually get attention.",
    category: "Analytics",
    publishedAt: "2026-03-29",
    readingTime: "3 min read",
    tags: ["metrics", "portfolio", "content strategy"],
    featured: false,
    content:
      "## Watch entry and exit points\n\nIt is useful to know which article started the session, but also which section likely caused the reader to stop. That gives more signal than view count alone.\n\n## Keep the list small\n\nThe more metrics you track, the less likely you are to use them. A compact set of repeatable signals is enough for the first few publishing cycles.",
  },
];

function ensurePostsFile() {
  const dataDir = path.dirname(POSTS_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(POSTS_FILE_PATH)) {
    fs.writeFileSync(POSTS_FILE_PATH, JSON.stringify(defaultPosts, null, 2), "utf-8");
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function calculateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

function normalizePost(post: BlogPost) {
  return {
    ...post,
    tags: post.tags ?? [],
    featured: Boolean(post.featured),
    readingTime: post.readingTime || calculateReadingTime(post.content),
  };
}

function sortByDateDesc(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function getAllPosts() {
  ensurePostsFile();

  const raw = fs.readFileSync(POSTS_FILE_PATH, "utf-8");
  const parsed = JSON.parse(raw) as BlogPost[];
  const normalized = parsed.map(normalizePost);

  return sortByDateDesc(normalized);
}

export function getFeaturedPosts() {
  return getAllPosts().filter((post) => post.featured).slice(0, 3);
}

export function getPostBySlug(slug: string) {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getRelatedPosts(slug: string) {
  return getAllPosts().filter((post) => post.slug !== slug).slice(0, 2);
}

export function formatPublishedDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function upsertPost(input: BlogPostInput) {
  ensurePostsFile();
  const posts = getAllPosts();

  const slug = input.slug && input.slug.trim() ? slugify(input.slug) : slugify(input.title);

  const nextPost: BlogPost = {
    slug,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    category: input.category.trim() || "General",
    publishedAt: input.publishedAt,
    tags: input.tags,
    featured: input.featured,
    content: input.content.trim(),
    readingTime: calculateReadingTime(input.content),
  };

  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    posts.push(nextPost);
  } else {
    posts[index] = nextPost;
  }

  const sorted = sortByDateDesc(posts);
  fs.writeFileSync(POSTS_FILE_PATH, JSON.stringify(sorted, null, 2), "utf-8");

  return nextPost;
}