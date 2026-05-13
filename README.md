# My Portfolio

All the info about me and about my shipped projects, also my portfolio website has an blog system where I write my opinions and blogs. My portfolio websites also include info about my future and in development projects xD.

## Features

- Portfolio homepage
- Blog index and individual blog pages
- Markdown blog editor with live preview
- Blog image uploads to `public/blog-images`
- Inline edit and delete actions for logged-in admin users
- Local autosave drafts for new posts and edits
- RSS feed at `/rss.xml`
- PGP page
- Shipped projects page

## Framework Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Markdown-it
- JSON-backed blog data in `data/posts.json`

## Getting Started
First install all the required packages by:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
