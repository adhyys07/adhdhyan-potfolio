import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const IMAGE_DIR = path.join(process.cwd(), "public", "blog-images");
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/gif", "gif"],
  ["image/webp", "webp"],
  ["image/svg+xml", "svg"],
]);

function isAuthorized(req: NextRequest) {
  return req.cookies.get("blog_admin")?.value === "1";
}

function slugifyFileName(input: string) {
  const parsed = path.parse(input);
  const name = parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 64);

  return name || "blog-image";
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "image file is required" }, { status: 400 });
  }

  const extension = ALLOWED_TYPES.get(file.type);

  if (!extension) {
    return NextResponse.json({ error: "Only jpeg, png, gif, webp, and svg images are supported" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Images must be 20MB or smaller" }, { status: 400 });
  }

  await fs.mkdir(IMAGE_DIR, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${slugifyFileName(file.name)}.${extension}`;
  const filePath = path.join(IMAGE_DIR, fileName);

  await fs.writeFile(filePath, buffer);

  return NextResponse.json({
    ok: true,
    url: `/blog-images/${fileName}`,
    markdown: `![${slugifyFileName(file.name)}](/blog-images/${fileName})`,
  });
}
