import Link from "next/link";

import { getFeaturedPosts } from "@/lib/blog";

export default function Home() {
  const featuredPosts = getFeaturedPosts();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(241,245,249,1)_40%,_rgba(226,232,240,1)_100%)] text-slate-950">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-12 px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
        <header className="flex flex-col gap-4 border-b border-slate-950/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Personal website
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Adhdhyan
            </h1>
          </div>
          <Link
            href="/writing"
            className="inline-flex items-center justify-center rounded-full border border-slate-950/15 bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            Explore my writing
          </Link>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-slate-950/10 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur">
              Developer, learner, and builder of useful digital experiences.
            </div>
            <div className="space-y-6">
              <h2 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                I design and build web products with thoughtful UX and clean engineering.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
                This homepage introduces who I am and what I focus on. All my
                articles, notes, case studies, and future writing are organized
                in one place under the writing section.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/writing"
                className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
              >
                Go to writing
              </Link>
              <a
                href="#featured-writing"
                className="rounded-full border border-slate-950/15 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition-colors hover:bg-white"
              >
                Featured posts
              </a>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-950/10 bg-slate-950 p-6 text-slate-50 shadow-2xl shadow-slate-950/10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              About me
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              I care about clarity in both code and communication.
            </h3>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ["Frontend", "Next.js, React, UI systems"],
                ["Backend", "APIs, integrations, tooling"],
                ["Writing", "notes, tutorials, case studies"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-semibold">{value}</div>
                  <div className="mt-1 text-sm text-slate-300">{label}</div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section id="featured-writing" className="grid gap-5 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-[1.75rem] border border-slate-950/10 bg-white/75 p-6 shadow-sm backdrop-blur transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                <span>{post.category}</span>
                <span>{post.readingTime}</span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
                {post.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {post.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-950/10 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/writing/${post.slug}`}
                className="mt-8 inline-flex items-center text-sm font-semibold text-slate-950 underline decoration-slate-950/20 underline-offset-4 transition group-hover:decoration-slate-950"
              >
                Read article
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
