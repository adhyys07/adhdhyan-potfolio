import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  formatPublishedDate,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blog";
import { markdownToHtml } from "@/lib/markdown";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function WritingPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug);
  const contentHtml = markdownToHtml(post.content);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
      <article className="space-y-10 rounded-[2rem] border border-slate-950/10 bg-white/85 p-6 shadow-sm backdrop-blur sm:p-8 lg:p-10">
        <div className="space-y-4">
          <Link
            href="/writing"
            className="inline-flex text-sm font-semibold text-slate-600 underline decoration-slate-950/20 underline-offset-4"
          >
            Back to writing
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            <span>{post.category}</span>
            <span>{formatPublishedDate(post.publishedAt)}</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {post.title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-950/10 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className="space-y-6 border-t border-slate-950/10 pt-8"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      <section className="grid gap-5 border-t border-slate-950/10 pt-8 sm:grid-cols-2">
        {relatedPosts.map((relatedPost) => (
          <article
            key={relatedPost.slug}
            className="rounded-[1.5rem] border border-slate-950/10 bg-slate-950 p-6 text-slate-50"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Related
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              {relatedPost.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {relatedPost.excerpt}
            </p>
            <Link
              href={`/writing/${relatedPost.slug}`}
              className="mt-6 inline-flex text-sm font-semibold text-amber-300 underline decoration-amber-300/30 underline-offset-4"
            >
              Read this next
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}