import Link from "next/link";
import { cookies } from "next/headers";

import { formatPublishedDate, getAllPosts } from "@/lib/blog";
import WritingPageClient from "@/components/writing-page-client";
import BlogEditorModal, { BlogInlineActions } from "@/components/blog-editor-modal";

export const metadata = {
  title: "Blogs",
  description: "Notes and essays.",
};

export default async function BlogsPage() {
  const posts = getAllPosts();
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("blog_admin")?.value === "1";

  return (
    <main style={{ minHeight: "100vh", background: "#0c0c0f", color: "#e8e6e0", fontFamily: "var(--font-jetbrains-mono), monospace" }}>
      <div className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10 sm:px-10">
        <div className="flex justify-end">
          <WritingPageClient isLoggedIn={isLoggedIn} />
        </div>

        <header className="max-w-2xl pt-14">
          <p style={{ fontSize: "10px", letterSpacing: "0.25em", color: "#9ca3af", textTransform: "uppercase", marginBottom: "10px" }}>
            05 - notes & essays
          </p>
          <h1 style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", lineHeight: "1.05", fontFamily: "var(--font-instrument-serif), serif", margin: "0 0 20px" }}>
            Blogs
          </h1>
          <div style={{ color: "#c4c4c4", fontSize: "1rem", lineHeight: "1.85" }}>
            <p>
               I write about,my current projects, my thoughts for currently trending topics and learning in public.
            </p>
          </div>
        </header>

        {isLoggedIn && (
          <div className="mt-8 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <span className="text-xs text-white/70">Logged in as dev</span>
            <BlogEditorModal posts={posts} />
          </div>
        )}

        <section className="mt-16">
          <ul className="space-y-5">
            {posts.map((post) => (
              <li key={post.slug} className="group">
                <div className="flex flex-wrap items-end gap-3">
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="flex min-w-0 flex-1 items-end gap-3 text-base leading-tight text-[#f4f4f4] transition-colors hover:text-[#d4f060] sm:text-[17px]"
                    style={{ textDecoration: "none" }}
                  >
                    <span className="min-w-0 break-words">{post.title}</span>
                    <span className="mb-[6px] min-w-8 flex-1 border-b border-white/10" />
                    <span className="shrink-0 text-xs text-white/35 sm:text-sm">
                      {formatPublishedDate(post.publishedAt)}
                    </span>
                  </Link>
                  {isLoggedIn ? <BlogInlineActions slug={post.slug} /> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer style={{ marginTop: "42px", textAlign: "center", color: "#9ca3af", fontSize: "0.95rem" }}>
          <span>made with caffeine and questionable life choices</span>
          <br />
          <span><Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Back to portfolio</Link> / <a href="#" style={{ color: "#9ca3af", textDecoration: "none" }}>source</a> / <a href="/pgp" style={{ color: "#9ca3af", textDecoration: "none" }}>pgp</a> / <a href="/rss.xml" style={{ color: "#9ca3af", textDecoration: "none" }}>rss</a></span>
        </footer>
      </div>
    </main>
  );
}
