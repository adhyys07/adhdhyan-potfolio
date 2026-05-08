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

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug);
  const contentHtml = markdownToHtml(post.content);

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0e", color: "#f3f3f3" }}>
      <div className="mx-auto w-full max-w-4xl px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
        <article style={{ marginBottom: "40px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "40px" }}>
          <div style={{ marginBottom: "30px" }}>
            <Link
              href="/blogs"
              style={{ color: "#d4f060", textDecoration: "none", fontSize: "0.95rem" }}
            >
              ← Back to blogs
            </Link>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <p style={{ fontSize: "10px", letterSpacing: "0.25em", color: "#9ca3af", textTransform: "uppercase", marginBottom: "10px" }}>
              {post.category} · {formatPublishedDate(post.publishedAt)} · {post.readingTime}
            </p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: "1.1", fontFamily: "Instrument Serif, serif", margin: "0 0 20px", color: "#f3f3f3" }}>
              {post.title}
            </h1>
            <p style={{ color: "#c4c4c4", fontSize: "1rem", lineHeight: "1.7", maxWidth: "600px" }}>
              {post.excerpt}
            </p>
            <div style={{ marginTop: "15px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "4px 10px",
                    fontSize: "11px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    color: "#9ca3af",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              color: "#c4c4c4",
              lineHeight: "1.7",
              fontSize: "0.95rem",
            }}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>

        {relatedPosts.length > 0 && (
          <section style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "40px", marginTop: "40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {relatedPosts.map((relatedPost) => (
              <article
                key={relatedPost.slug}
                style={{
                  padding: "20px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <p style={{ fontSize: "10px", letterSpacing: "0.25em", color: "#9ca3af", textTransform: "uppercase", marginBottom: "10px" }}>
                  Related
                </p>
                <h3 style={{ fontSize: "1.3rem", fontFamily: "Instrument Serif, serif", margin: "10px 0", color: "#f3f3f3" }}>
                  {relatedPost.title}
                </h3>
                <p style={{ color: "#c4c4c4", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "15px" }}>
                  {relatedPost.excerpt}
                </p>
                <Link
                  href={`/blogs/${relatedPost.slug}`}
                  style={{ color: "#d4f060", textDecoration: "none", fontSize: "0.95rem" }}
                >
                  Read this next →
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
