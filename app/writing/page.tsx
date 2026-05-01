import Link from "next/link";
import { cookies } from "next/headers";

import { formatPublishedDate, getAllPosts } from "@/lib/blog";
import WritingPageClient from "@/components/writing-page-client";
import BlogEditorModal from "@/components/blog-editor-modal";

export const metadata = {
  title: "Writing",
  description: "Notes and writing.",
};

export default async function WritingPage() {
  const posts = getAllPosts();
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("blog_admin")?.value === "1";

  return (
    <main className="min-h-screen bg-[#111111] text-[#f2f2f2]">
      <div className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10 sm:px-10">
        <div className="flex justify-end">
          <WritingPageClient isLoggedIn={isLoggedIn} />
        </div>

        <header className="max-w-xl pt-14">
          <p className="text-sm font-semibold tracking-tight text-[#e8e8e8]">
            leo&apos;s notes
          </p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-[#ededed] sm:text-[15px]">
            <p>
              hi. my name is leo. below, you&apos;ll find a collection of my learnings
              from my work at hack club and through wider life.
            </p>
            <p>some may be private, so you might not find them below.</p>
            <p>if you want to chat more, send me an email.</p>
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
                <Link
                  href={`/writing/${post.slug}`}
                  className="flex items-end gap-3 text-base leading-tight text-[#f4f4f4] transition-colors hover:text-white sm:text-[17px]"
                >
                  <span className="whitespace-nowrap">{post.title}</span>
                  <span className="mb-[6px] flex-1 border-b border-white/10" />
                  <span className="shrink-0 text-xs text-white/35 sm:text-sm">
                    {formatPublishedDate(post.publishedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}