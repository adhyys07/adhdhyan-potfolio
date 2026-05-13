"use client";

import {
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { markdownToHtml } from "@/lib/markdown";
import styles from "./blog-editor-modal.module.css";

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
  controls?: "toolbar" | "none";
};

type Mode = "create" | "edit" | "delete";

type BlogDraft = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  tags: string;
  featured: boolean;
  content: string;
  savedAt: string;
};

const DRAFT_KEY_PREFIX = "blog-editor-draft:";

const defaultMarkdown = `## Start here

Write the sharpest version of the idea first. Keep the intro short, then make the useful part easy to scan.

### GitHub-style markdown works here

- [x] Task lists
- [ ] Tables, links, images, quotes, and code
- [ ] Paste or drop an image to upload it

| Thing | Syntax |
| --- | --- |
| Image | \`![alt](/blog-images/file.png)\` |
| Link | \`[text](https://example.com)\` |
`;

const toolbarItems = [
  { label: "B", left: "**", right: "**", placeholder: "bold text" },
  { label: "I", left: "*", right: "*", placeholder: "italic text" },
  { label: "S", left: "~~", right: "~~", placeholder: "struck text" },
  { label: "Code", left: "`", right: "`", placeholder: "code" },
  { label: "H2", left: "\n## ", right: "", placeholder: "Section title" },
  { label: "H3", left: "\n### ", right: "", placeholder: "Small section" },
  { label: "List", left: "\n- ", right: "", placeholder: "item" },
  { label: "Task", left: "\n- [ ] ", right: "", placeholder: "todo" },
  { label: "Table", left: "\n| Column | Value |\n| --- | --- |\n| ", right: " | detail |\n", placeholder: "item" },
  { label: "Quote", left: "\n> ", right: "", placeholder: "quote" },
  { label: "Block", left: "\n```\n", right: "\n```", placeholder: "code" },
  { label: "Link", left: "[", right: "](https://example.com)", placeholder: "link text" },
  { label: "Image", left: "![", right: "](https://example.com/image.png)", placeholder: "alt text" },
  { label: "Rule", left: "\n---\n", right: "", placeholder: "" },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function getDraftKey(mode: Mode, originalSlug: string) {
  if (mode === "create") return `${DRAFT_KEY_PREFIX}new`;
  if (mode === "edit" && originalSlug) return `${DRAFT_KEY_PREFIX}${originalSlug}`;
  return "";
}

function formatDraftTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function BlogEditorModal({ posts, controls = "toolbar" }: Props) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [originalSlug, setOriginalSlug] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("General");
  const [publishedAt, setPublishedAt] = useState(today());
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [content, setContent] = useState(defaultMarkdown);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [status, setStatus] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState("");

  const previewHtml = useMemo(() => markdownToHtml(content), [content]);
  const draftKey = getDraftKey(mode, originalSlug);
  const canDiscardDraft = isOpen && mode !== "delete" && draftKey.length > 0;
  const isSuccess =
    status.startsWith("Saved") || status.startsWith("Deleted") || status.startsWith("Image uploaded");

  function resetCreateForm() {
    setOriginalSlug("");
    setSlug("");
    setTitle("");
    setExcerpt("");
    setCategory("General");
    setPublishedAt(today());
    setTags("");
    setFeatured(false);
    setContent(defaultMarkdown);
    setStatus("");
    setAutoSaveStatus("");
  }

  const loadForEdit = useCallback((nextSlug: string) => {
    const post = posts.find((item) => item.slug === nextSlug);
    if (!post) return;

    setOriginalSlug(post.slug);
    setSlug(post.slug);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setCategory(post.category);
    setPublishedAt(post.publishedAt);
    setTags(post.tags.join(", "));
    setFeatured(post.featured);
    setContent(post.content);
    setStatus("");
  }, [posts]);

  const restoreDraft = useCallback((key: string) => {
    try {
      const rawDraft = window.localStorage.getItem(key);
      if (!rawDraft) return false;

      const draft = JSON.parse(rawDraft) as Partial<BlogDraft>;

      setSlug(draft.slug ?? "");
      setTitle(draft.title ?? "");
      setExcerpt(draft.excerpt ?? "");
      setCategory(draft.category ?? "General");
      setPublishedAt(draft.publishedAt ?? today());
      setTags(draft.tags ?? "");
      setFeatured(Boolean(draft.featured));
      setContent(draft.content ?? defaultMarkdown);
      setAutoSaveStatus(
        draft.savedAt ? `Restored local draft from ${formatDraftTime(draft.savedAt)}.` : "Restored local draft.",
      );
      setStatus("");
      return true;
    } catch {
      setAutoSaveStatus("Could not restore local draft.");
      return false;
    }
  }, []);

  function openCreate() {
    setMode("create");
    resetCreateForm();
    restoreDraft(`${DRAFT_KEY_PREFIX}new`);
    setIsOpen(true);
  }

  const openEditForPost = useCallback((nextSlug: string) => {
    setMode("edit");
    loadForEdit(nextSlug);
    restoreDraft(`${DRAFT_KEY_PREFIX}${nextSlug}`);
    setIsOpen(true);
  }, [loadForEdit, restoreDraft]);

  const openDeleteForPost = useCallback((nextSlug: string) => {
    setMode("delete");
    loadForEdit(nextSlug);
    setIsOpen(true);
  }, [loadForEdit]);

  function clearDraft(key = draftKey) {
    if (!key) return;

    try {
      window.localStorage.removeItem(key);
      setAutoSaveStatus("");
    } catch {
      setAutoSaveStatus("Could not clear local draft.");
    }
  }

  function discardDraft() {
    clearDraft();
    closeModal();
  }

  useEffect(() => {
    function handleOpenEvent(event: Event) {
      const { mode: nextMode, slug: nextSlug } = (event as CustomEvent<{ mode?: Mode; slug?: string }>).detail ?? {};

      if ((nextMode !== "edit" && nextMode !== "delete") || !nextSlug) return;

      if (nextMode === "edit") {
        openEditForPost(nextSlug);
        return;
      }

      openDeleteForPost(nextSlug);
    }

    window.addEventListener("blog-editor-open", handleOpenEvent);
    return () => window.removeEventListener("blog-editor-open", handleOpenEvent);
  }, [openDeleteForPost, openEditForPost]);

  useEffect(() => {
    if (!isOpen || mode === "delete" || !draftKey) return;

    const timeout = window.setTimeout(() => {
      const savedAt = new Date().toISOString();
      const draft: BlogDraft = {
        slug,
        title,
        excerpt,
        category,
        publishedAt,
        tags,
        featured,
        content,
        savedAt,
      };

      try {
        window.localStorage.setItem(draftKey, JSON.stringify(draft));
        setAutoSaveStatus(`Draft autosaved locally at ${formatDraftTime(savedAt)}.`);
      } catch {
        setAutoSaveStatus("Could not autosave draft locally.");
      }
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [category, content, draftKey, excerpt, featured, isOpen, mode, publishedAt, slug, tags, title]);

  function closeModal() {
    setIsOpen(false);
    setStatus("");
    setDeleteConfirmOpen(false);
    setDeleteConfirmText("");
  }

  function insertMarkdown(left: string, right = "", placeholder = "") {
    const textarea = document.getElementById("blog-content-editor") as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const next = content.slice(0, start) + left + selected + right + content.slice(end);
    setContent(next);

    window.setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + left.length;
      textarea.selectionEnd = start + left.length + selected.length;
    }, 0);
  }

  function insertTextAtCursor(text: string) {
    const textarea = document.getElementById("blog-content-editor") as HTMLTextAreaElement | null;

    if (!textarea) {
      setContent((current) => `${current}\n\n${text}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const prefix = content.slice(0, start);
    const suffix = content.slice(end);
    const needsLeadingBreak = prefix && !prefix.endsWith("\n") ? "\n\n" : "";
    const needsTrailingBreak = suffix && !suffix.startsWith("\n") ? "\n\n" : "";
    const inserted = `${needsLeadingBreak}${text}${needsTrailingBreak}`;

    setContent(prefix + inserted + suffix);

    window.setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + inserted.length;
      textarea.selectionEnd = start + inserted.length;
    }, 0);
  }

  async function uploadImage(file: File) {
    setIsUploadingImage(true);
    setStatus("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/blog-images", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { error?: string; markdown?: string };

      if (!response.ok || !data.markdown) {
        setStatus(data.error ?? "Could not upload image.");
        return;
      }

      insertTextAtCursor(data.markdown);
      setStatus("Image uploaded and inserted.");
    } catch {
      setStatus("Could not upload image. Check your connection.");
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  }

  async function handleImageInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  }

  async function handleEditorPaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const imageFile = Array.from(event.clipboardData.files).find((file) => file.type.startsWith("image/"));

    if (!imageFile) return;

    event.preventDefault();
    await uploadImage(imageFile);
  }

  async function handleEditorDrop(event: DragEvent<HTMLTextAreaElement>) {
    const imageFile = Array.from(event.dataTransfer.files).find((file) => file.type.startsWith("image/"));

    if (!imageFile) return;

    event.preventDefault();
    await uploadImage(imageFile);
  }

  async function handleSubmit() {
    if (!title.trim()) {
      setStatus("Title is required.");
      return;
    }
    if (!excerpt.trim()) {
      setStatus("Excerpt is required.");
      return;
    }
    if (!content.trim()) {
      setStatus("Content is required.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Saving post...");

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalSlug: mode !== "create" ? originalSlug : undefined,
          slug: slug.trim() || undefined,
          title: title.trim(),
          excerpt: excerpt.trim(),
          category: category.trim() || "General",
          publishedAt,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          featured,
          content: content.trim(),
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus(data.error ?? "Could not save post.");
        return;
      }

      clearDraft();
      setStatus("Saved successfully. Reloading...");
      window.setTimeout(() => window.location.reload(), 700);
    } catch {
      setStatus("Could not save post. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if ((mode !== "edit" && mode !== "delete") || !originalSlug) return;
    setDeleteConfirmText("");
    setDeleteConfirmOpen(true);
  }

  async function confirmDelete() {
    if ((mode !== "edit" && mode !== "delete") || !originalSlug || deleteConfirmText.trim() !== "delete") return;

    setIsSubmitting(true);
    setStatus("Deleting post...");

    try {
      const response = await fetch(`/api/blogs?slug=${encodeURIComponent(originalSlug)}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus(data.error ?? "Could not delete post.");
        return;
      }

      clearDraft(`${DRAFT_KEY_PREFIX}${originalSlug}`);
      setStatus("Deleted successfully. Reloading...");
      window.setTimeout(() => window.location.reload(), 700);
    } catch {
      setStatus("Could not delete post. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {controls === "toolbar" ? (
        <div className={styles.actions}>
          <button type="button" onClick={openCreate} className={styles.button}>
            Add blog
          </button>
        </div>
      ) : null}

      {isOpen ? (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <header className={styles.header}>
              <div>
                <p className={styles.eyebrow}>
                  {mode === "create" ? "New draft" : mode === "delete" ? "Remove post" : "Update post"}
                </p>
                <h2 className={styles.title}>
                  {mode === "create" ? "Create blog post" : mode === "delete" ? "Delete blog post" : "Edit blog post"}
                </h2>
              </div>
              <button type="button" onClick={closeModal} className={styles.iconButton} aria-label="Close">
                X
              </button>
            </header>

            <div className={styles.body}>
              {mode === "delete" ? (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle}>Delete confirmation</h3>
                  <div className={styles.deleteSummary}>
                    <p className={styles.deleteTitle}>{title || "No post selected"}</p>
                    <p className={styles.deleteMeta}>
                      {category} / {publishedAt} / {tags || "no tags"}
                    </p>
                    <p className={styles.deleteExcerpt}>{excerpt}</p>
                  </div>
                </section>
              ) : null}

              {mode !== "delete" ? (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Post details</h3>
                <div className={styles.gridTwo}>
                  <label className={styles.label}>
                    Title *
                    <input
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="A useful title"
                      className={styles.input}
                    />
                  </label>
                  <label className={styles.label}>
                    Slug
                    <input
                      value={slug}
                      onChange={(event) => setSlug(event.target.value)}
                      placeholder="auto-generated-from-title"
                      className={styles.input}
                    />
                  </label>
                </div>

                <label className={`${styles.label} mt-3`}>
                  Excerpt *
                  <input
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    placeholder="One sentence that makes the post worth opening"
                    className={styles.input}
                  />
                </label>

                <div className={`${styles.gridThree} mt-3`}>
                  <label className={styles.label}>
                    Category
                    <input
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      placeholder="Engineering"
                      className={styles.input}
                    />
                  </label>
                  <label className={styles.label}>
                    Publish date
                    <input
                      type="date"
                      value={publishedAt}
                      onChange={(event) => setPublishedAt(event.target.value)}
                      className={styles.input}
                    />
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(event) => setFeatured(event.target.checked)}
                    />
                    Featured
                  </label>
                </div>

                <label className={`${styles.label} mt-3`}>
                  Tags
                  <input
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    placeholder="next.js, design, notes"
                    className={styles.input}
                  />
                </label>
              </section>
              ) : null}

              {mode !== "delete" ? (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Formatting</h3>
                <div className={styles.toolbar}>
                  {toolbarItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => insertMarkdown(item.left, item.right, item.placeholder)}
                      className={styles.toolButton}
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className={styles.toolButton}
                  >
                    {isUploadingImage ? "Uploading..." : "Upload image"}
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                    onChange={handleImageInputChange}
                    className={styles.fileInput}
                  />
                </div>
              </section>
              ) : null}

              {mode !== "delete" ? (
              <section className={`${styles.editorGrid} ${showPreview ? "" : styles.editorGridFull}`}>
                <div>
                  <div className={styles.panelHeader}>
                    <span>Markdown content *</span>
                    <button
                      type="button"
                      onClick={() => setShowPreview((value) => !value)}
                      className={styles.ghostButton}
                    >
                      {showPreview ? "Hide preview" : "Show preview"}
                    </button>
                  </div>
                  <textarea
                    id="blog-content-editor"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    onPaste={handleEditorPaste}
                    onDrop={handleEditorDrop}
                    className={styles.textarea}
                  />
                </div>

                {showPreview ? (
                  <div>
                    <div className={styles.panelHeader}>Live preview</div>
                    <div
                      className={`${styles.preview} blog-prose`}
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  </div>
                ) : null}
              </section>
              ) : null}
            </div>

            <footer className={styles.footer}>
              <p className={`${styles.status} ${isSuccess || (!status && autoSaveStatus) ? styles.statusSuccess : ""}`}>
                {status || autoSaveStatus || " "}
              </p>
              <div className={`${styles.actions} ${styles.footerActions}`}>
                {canDiscardDraft ? (
                  <button
                    type="button"
                    onClick={discardDraft}
                    disabled={isSubmitting}
                    className={styles.ghostButton}
                  >
                    Discard autosave
                  </button>
                ) : null}
                {mode !== "create" ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className={styles.dangerButton}
                  >
                    {isSubmitting ? "Deleting..." : "Delete post"}
                  </button>
                ) : null}
                {mode !== "delete" ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={styles.button}
                  >
                    {isSubmitting ? "Saving..." : mode === "create" ? "Publish post" : "Save changes"}
                  </button>
                ) : null}
              </div>
            </footer>

            {deleteConfirmOpen ? (
              <div className={styles.confirmOverlay} onClick={() => setDeleteConfirmOpen(false)}>
                <div
                  className={styles.confirmDialog}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="delete-confirm-title"
                  onClick={(event) => event.stopPropagation()}
                >
                  <p className={styles.eyebrow}>Permanent delete</p>
                  <h3 id="delete-confirm-title" className={styles.confirmTitle}>
                    Delete {title ? `"${title}"` : "this post"}?
                  </h3>
                  <p className={styles.confirmCopy}>
                    This removes the post from your blog data. Type <strong>delete</strong> to confirm.
                  </p>
                  <input
                    value={deleteConfirmText}
                    onChange={(event) => setDeleteConfirmText(event.target.value)}
                    placeholder="delete"
                    className={styles.input}
                    autoFocus
                  />
                  <div className={styles.confirmActions}>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmOpen(false)}
                      disabled={isSubmitting}
                      className={styles.ghostButton}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmDelete}
                      disabled={isSubmitting || deleteConfirmText.trim() !== "delete"}
                      className={styles.dangerButton}
                    >
                      {isSubmitting ? "Deleting..." : "Permanently delete"}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

export function BlogInlineActions({ slug }: { slug: string }) {
  return (
    <span className={styles.inlineActions}>
      <button
        type="button"
        onClick={() => {
          const event = new CustomEvent("blog-editor-open", { detail: { mode: "edit", slug } });
          window.dispatchEvent(event);
        }}
        className={styles.inlineButton}
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => {
          const event = new CustomEvent("blog-editor-open", { detail: { mode: "delete", slug } });
          window.dispatchEvent(event);
        }}
        className={styles.inlineDangerButton}
      >
        Delete
      </button>
    </span>
  );
}
