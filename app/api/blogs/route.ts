import { NextRequest, NextResponse } from "next/server";

import { deletePost, getAllPosts, type BlogPostInput, upsertPost } from "@/lib/blog";

function isAuthorized(req: NextRequest) {
  return req.cookies.get("blog_admin")?.value === "1";
}

export function GET() {
  const posts = getAllPosts();
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Partial<BlogPostInput>;

  if (!body.title || !body.content || !body.excerpt || !body.publishedAt) {
    return NextResponse.json(
      { error: "title, excerpt, content, and publishedAt are required" },
      { status: 400 },
    );
  }

  try {
    const nextPost = upsertPost({
      originalSlug: body.originalSlug,
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category ?? "General",
      tags: body.tags ?? [],
      featured: Boolean(body.featured),
      publishedAt: body.publishedAt,
    });

    return NextResponse.json({ ok: true, post: nextPost });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save post" },
      { status: 400 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const deleted = deletePost(slug);

  if (!deleted) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
