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

const defaultMarkdown = `## Introduction

Write your post here. Use markdown formatting:

### Features
- Bold text with **text**
- Italic with *text*
- Code blocks with \`\`\`
- Images with ![alt](url)

---

Happy writing!`;

type Mode = "create" | "edit";

export default function BlogEditorModal({ posts }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [selectedSlug, setSelectedSlug] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("General");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().slice(0, 10));
  const [tags, setTags] = useState("");
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
    setTags("");
    setFeatured(false);
    setContent(defaultMarkdown);
    setStatus("");
  }

  function loadForEdit(nextSlug: string) {
    setSelectedSlug(nextSlug);
    const post = posts.find((item) => item.slug === nextSlug);
    if (!post) return;

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

  function insertMarkdown(left: string, right = "", placeholder = "") {
    const textarea = document.getElementById("blog-content-editor") as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const next = content.slice(0, start) + left + selected + right + content.slice(end);
    setContent(next);
    
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + left.length;
      textarea.selectionEnd = start + left.length + selected.length;
    }, 0);
  }

  async function handleSubmit() {
    if (!title.trim()) {
      setStatus("Title is required");
      return;
    }
    if (!excerpt.trim()) {
      setStatus("Excerpt is required");
      return;
    }
    if (!content.trim()) {
      setStatus("Content is required");
      return;
    }

    setIsSubmitting(true);
    setStatus("Saving post...");

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim() || undefined,
          title: title.trim(),
          excerpt: excerpt.trim(),
          category: category.trim() || "General",
          publishedAt,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          featured,
          content: content.trim(),
        }),
      });

      const data = (await response.json()) as { error?: string; post?: { slug: string } };

      if (!response.ok) {
        setStatus(`Error: ${data.error ?? "Could not save post"}`);
        return;
      }

      setStatus(`✓ Saved successfully. Reloading...`);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      setStatus("Error: Could not save post. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={openCreate}
          style={{
            background: "#d4f060",
            color: "#0b0b0e",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            fontWeight: "600",
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          + Add blog
        </button>
        <button
          onClick={openEdit}
          disabled={posts.length === 0}
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "#c4c4c4",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid rgba(255,255,255,0.1)",
            fontWeight: "600",
            fontSize: "0.9rem",
            cursor: posts.length === 0 ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: posts.length === 0 ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (posts.length > 0) {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            }
          }}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
        >
          ✎ Edit existing
        </button>
      </div>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.7)",
            padding: "16px",
            backdropFilter: "blur(4px)",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "95vh",
              overflow: "hidden",
              width: "100%",
              maxWidth: "1100px",
              borderRadius: "12px",
              background: "#0b0b0e",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                padding: "20px 24px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "600",
                    color: "#f3f3f3",
                    margin: 0,
                    fontFamily: "Instrument Serif, serif",
                  }}
                >
                  {mode === "create" ? "New Blog Post" : "Edit Blog Post"}
                </h2>
                <p style={{ fontSize: "0.85rem", color: "#9ca3af", margin: "4px 0 0" }}>
                  Markdown supported • Images • Code blocks
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#c4c4c4",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ overflowY: "auto", flex: 1, padding: "24px" }}>
              {/* Meta fields */}
              <div style={{ marginBottom: "24px" }}>
                <h3
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.25em",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  Post Details
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.85rem", color: "#c4c4c4", marginBottom: "6px" }}>
                      Title *
                    </span>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Your post title"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#f3f3f3",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                        fontFamily: "inherit",
                      }}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.85rem", color: "#c4c4c4", marginBottom: "6px" }}>
                      Slug (auto-generated)
                    </span>
                    <input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="post-slug"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#f3f3f3",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                        fontFamily: "inherit",
                      }}
                    />
                  </label>
                </div>

                <label style={{ display: "flex", flexDirection: "column", marginTop: "12px" }}>
                  <span style={{ fontSize: "0.85rem", color: "#c4c4c4", marginBottom: "6px" }}>
                    Excerpt *
                  </span>
                  <input
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Short summary of your post"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#f3f3f3",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontFamily: "inherit",
                    }}
                  />
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "12px" }}>
                  <label style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.85rem", color: "#c4c4c4", marginBottom: "6px" }}>
                      Category
                    </span>
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g., Tutorial"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#f3f3f3",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                        fontFamily: "inherit",
                      }}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.85rem", color: "#c4c4c4", marginBottom: "6px" }}>
                      Publish Date
                    </span>
                    <input
                      type="date"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#f3f3f3",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        fontSize: "0.9rem",
                        fontFamily: "inherit",
                      }}
                    />
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "18px" }}>
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      style={{ cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.85rem", color: "#c4c4c4" }}>Featured</span>
                  </label>
                </div>

                <label style={{ display: "flex", flexDirection: "column", marginTop: "12px" }}>
                  <span style={{ fontSize: "0.85rem", color: "#c4c4c4", marginBottom: "6px" }}>
                    Tags (comma separated)
                  </span>
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., tutorial, next.js, design"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#f3f3f3",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontFamily: "inherit",
                    }}
                  />
                </label>
              </div>

              {/* Markdown toolbar */}
              <div style={{ marginBottom: "16px" }}>
                <h3
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.25em",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Formatting
                </h3>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {[
                    { label: "**Bold**", onClick: () => insertMarkdown("**", "**", "bold text") },
                    { label: "*Italic*", onClick: () => insertMarkdown("*", "*", "italic") },
                    { label: "`Code`", onClick: () => insertMarkdown("`", "`", "code") },
                    { label: "# H1", onClick: () => insertMarkdown("\n# ", "") },
                    { label: "## H2", onClick: () => insertMarkdown("\n## ", "") },
                    { label: "### H3", onClick: () => insertMarkdown("\n### ", "") },
                    { label: "- List", onClick: () => insertMarkdown("\n- ", "", "item") },
                    { label: "```Code", onClick: () => insertMarkdown("\n```\n", "\n```") },
                    { label: "![Image](url)", onClick: () => insertMarkdown("![alt](", ")") },
                    { label: "[Link](url)", onClick: () => insertMarkdown("[", "](https://example.com)") },
                    { label: "---", onClick: () => insertMarkdown("\n---\n", "") },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={btn.onClick}
                      style={{
                        background: "rgba(212,240,96,0.1)",
                        border: "1px solid rgba(212,240,96,0.3)",
                        color: "#d4f060",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(212,240,96,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(212,240,96,0.1)";
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor & Preview */}
              <div style={{ display: "grid", gridTemplateColumns: showPreview ? "1fr 1fr" : "1fr", gap: "16px" }}>
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: "#c4c4c4",
                      }}
                    >
                      Markdown Content *
                    </h3>
                  </div>
                  <textarea
                    id="blog-content-editor"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                      width: "100%",
                      height: "400px",
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#f3f3f3",
                      padding: "12px",
                      borderRadius: "6px",
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.85rem",
                      lineHeight: "1.6",
                      resize: "vertical",
                    }}
                  />
                </div>

                {showPreview && (
                  <div>
                    <h3
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: "#c4c4c4",
                        marginBottom: "8px",
                      }}
                    >
                      Live Preview
                    </h3>
                    <div
                      style={{
                        height: "400px",
                        overflowY: "auto",
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "6px",
                        padding: "12px",
                      }}
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                padding: "16px 24px",
                background: "rgba(0,0,0,0.2)",
              }}
            >
              <p style={{ fontSize: "0.85rem", color: status.includes("✓") ? "#d4f060" : "#f08060", margin: 0 }}>
                {status || " "}
              </p>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  background: "#d4f060",
                  color: "#0b0b0e",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.6 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {isSubmitting ? "Saving..." : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}