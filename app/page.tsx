import { Instrument_Serif, JetBrains_Mono } from "next/font/google";

import PortfolioIndex from "@/components/portfolio-index";
import { getAllPosts } from "@/lib/blog";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export default function Home() {
  // lib/blog.ts reads from disk, so the posts are gathered here on the server
  // and handed to the client component as plain data.
  const posts = getAllPosts()
    .slice(0, 4)
    .map(({ slug, title, publishedAt, category }) => ({ slug, title, publishedAt, category }));

  return (
    <PortfolioIndex
      fontClassName={`${instrumentSerif.variable} ${jetBrainsMono.variable}`}
      posts={posts}
    />
  );
}
