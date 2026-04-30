import Link from "next/link";

import BlogEditorModal from "@/components/blog-editor-modal";
import { formatPublishedDate, getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Writing",
  description: "All writing: blogs, notes, tutorials, and case studies.",
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
      <BlogEditorModal posts={posts} />

      <section className="grid gap-6 rounded-[2rem] border border-slate-950/10 bg-slate-950 px-6 py-8 text-slate-50 shadow-2xl shadow-slate-950/10 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Writing
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            One place for everything I write.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            This is the singular writing page for blogs, notes, case studies,
            and future long-form content.
          </p>
        </div>
        <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300 sm:grid-cols-3 lg:grid-cols-1">
          <div>
            <div className="text-2xl font-semibold text-white">{posts.length}</div>
            <div className="mt-1">total posts</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">1</div>
            <div className="mt-1">central writing hub</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">100%</div>
            <div className="mt-1">organized in one section</div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="grid gap-5">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-[1.75rem] border border-slate-950/10 bg-white/80 p-6 shadow-sm backdrop-blur"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                <span>{post.category}</span>
                <span>{formatPublishedDate(post.publishedAt)}</span>
                <span>{post.readingTime}</span>
              </div>
              <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                    {post.excerpt}
                  </p>
                </div>
                <Link
                  href={`/writing/${post.slug}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-full border border-slate-950/15 bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                >
                  Open post
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-950/10 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <aside className="rounded-[1.75rem] border border-slate-950/10 bg-amber-100 p-6 text-slate-950">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Why this page
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            A single home for all written content.
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Instead of splitting blogs and notes into separate areas, this page
            centralizes everything so readers can find and browse your writing
            from one route.
          </p>
        </aside>
      </section>
    </main>
  );
}