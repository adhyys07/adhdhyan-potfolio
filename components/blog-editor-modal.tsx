"use client";

import { useMemo, useState } from "react";

import { markdownToHtml } from "@/lib/markdown";

type BlogPost = {
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

type Props = {
  posts: BlogPost[];
};

const defaultMarkdown = "## Introduction\n\nWrite your post here.\n\n- First point\n- Second point\n";

type Mode = "create" | "edit";

export default function BlogEditorModal({ posts }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [selectedSlug, setSelectedSlug] = useState("");

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("General");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().slice(0, 10));
  const [tags, setTags] = useState("writing");
  const [featured, setFeatured] = useState(false);
  const [content, setContent] = useState(defaultMarkdown);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const previewHtml = useMemo(() => markdownToHtml(content), [content]);

  function resetCreateForm() {
    setSelectedSlug("");
    setSlug("");
    setTitle("");
    setExcerpt("");
    setCategory("General");
    setPublishedAt(new Date().toISOString().slice(0, 10));
    setTags("writing");
    setFeatured(false);
    setContent(defaultMarkdown);
    setStatus("");
  }


  function loadForEdit(nextSlug: string) {
    setSelectedSlug(nextSlug);
    const post = posts.find((item) => item.slug === nextSlug);
    if (!post) {
      return;
    }

    setSlug(post.slug);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setCategory(post.category);
    setPublishedAt(post.publishedAt);
    setTags(post.tags.join(", "));
    setFeatured(post.featured);
    setContent(post.content);
    setStatus("");
  }

  function openCreate() {
    setMode("create");
    resetCreateForm();
    setIsOpen(true);
  }

  function openEdit() {
    setMode("edit");
    if (posts.length > 0) {
      loadForEdit(posts[0].slug);
    }
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setStatus("");
  }

  function wrapSelectedMarkdown(left: string, right = "") {
    const textarea = document.getElementById("blog-content-editor") as HTMLTextAreaElement | null;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const next = content.slice(0, start) + left + selected + right + content.slice(end);
    setContent(next);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setStatus("Saving post...");

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim() || undefined,
          title,
          excerpt,
          category,
          publishedAt,
          tags: tags
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          featured,
          content,
        }),
      });

      const data = (await response.json()) as { error?: string; post?: { slug: string } };

      if (!response.ok) {
        setStatus(data.error ?? "Could not save post.");
        return;
      }

      setStatus(`Saved successfully. Open /writing/${data.post?.slug ?? ""}`);
      window.location.reload();
    } catch {
      setStatus("Could not save post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={openCreate}
          className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
        >
          Add blog
        </button>
        <button
          type="button"
          onClick={openEdit}
          className="rounded-full border border-slate-950/15 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          disabled={posts.length === 0}
        >
          Edit existing
        </button>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.5rem] border border-slate-950/10 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-950/10 px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                  {mode === "create" ? "Add a new blog post" : "Edit blog post"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Supports markdown formatting with live preview.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-950/15 px-4 py-2 text-sm font-medium text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {mode === "edit" ? (
                  <label className="sm:col-span-2">
                    <div className="mb-1 text-sm font-medium text-slate-700">Select post</div>
                    <select
                      value={selectedSlug}
                      onChange={(event) => loadForEdit(event.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                    >
                      {posts.map((post) => (
                        <option key={post.slug} value={post.slug}>
                          {post.title}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                <label>
                  <div className="mb-1 text-sm font-medium text-slate-700">Title</div>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label>
                  <div className="mb-1 text-sm font-medium text-slate-700">Slug (optional)</div>
                  <input
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="sm:col-span-2">
                  <div className="mb-1 text-sm font-medium text-slate-700">Excerpt</div>
                  <input
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label>
                  <div className="mb-1 text-sm font-medium text-slate-700">Category</div>
                  <input
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label>
                  <div className="mb-1 text-sm font-medium text-slate-700">Publish date</div>
                  <input
                    type="date"
                    value={publishedAt}
                    onChange={(event) => setPublishedAt(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label>
                  <div className="mb-1 text-sm font-medium text-slate-700">Tags (comma separated)</div>
                  <input
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="inline-flex items-center gap-2 pt-6 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(event) => setFeatured(event.target.checked)}
                  />
                  Featured post
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => wrapSelectedMarkdown("**", "**")}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  Bold
                </button>
                <button
                  type="button"
                  onClick={() => wrapSelectedMarkdown("*", "*")}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  Italic
                </button>
                <button
                  type="button"
                  onClick={() => wrapSelectedMarkdown("`", "`")}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  Inline code
                </button>
                <button
                  type="button"
                  onClick={() => setContent((prev) => `${prev}\n\n## New heading\n`)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  Heading
                </button>
                <button
                  type="button"
                  onClick={() => setContent((prev) => `${prev}\n\n- List item\n- Another item\n`)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  Bullet list
                </button>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Markdown editor</p>
                  <textarea
                    id="blog-content-editor"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    className="h-[340px] w-full rounded-xl border border-slate-300 p-3 font-mono text-sm"
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Live preview</p>
                  <div
                    className="h-[340px] overflow-y-auto rounded-xl border border-slate-300 bg-slate-50 p-4"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-950/10 px-6 py-4">
              <p className="text-sm text-slate-600">{status}</p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save post"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}