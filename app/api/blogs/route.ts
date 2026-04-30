import { NextRequest, NextResponse } from "next/server";

import { getAllPosts, type BlogPostInput, upsertPost } from "@/lib/blog";

function isAuthorized(req: NextRequest) {
  const requiredToken = process.env.ADMIN_WRITE_TOKEN;
  if (!requiredToken) {
    return true;
  }

  const providedToken = req.headers.get("x-admin-token");
  return providedToken === requiredToken;
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

  const nextPost = upsertPost({
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
}