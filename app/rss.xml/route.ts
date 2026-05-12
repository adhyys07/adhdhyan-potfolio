import { getAllPosts } from "@/lib/blog";
import { markdownToHtml } from "@/lib/markdown";

export const dynamic = "force-dynamic";

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function escapeXml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(input: string) {
  return `<![CDATA[${input.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

export function GET() {
  const siteUrl = getSiteUrl();
  const posts = getAllPosts();
  const lastBuildDate = posts[0]?.publishedAt
    ? new Date(posts[0].publishedAt).toUTCString()
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blogs/${post.slug}`;
      const publishedAt = new Date(post.publishedAt).toUTCString();
      const content = markdownToHtml(post.content);

      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${escapeXml(url)}</link>
          <guid isPermaLink="true">${escapeXml(url)}</guid>
          <description>${cdata(post.excerpt)}</description>
          <content:encoded>${cdata(content)}</content:encoded>
          <category>${escapeXml(post.category)}</category>
          ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("")}
          <pubDate>${publishedAt}</pubDate>
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Adhdhyan Portfolio Blog</title>
    <link>${escapeXml(`${siteUrl}/blogs`)}</link>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />
    <description>Notes on building products, shipping games, and learning in public.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
