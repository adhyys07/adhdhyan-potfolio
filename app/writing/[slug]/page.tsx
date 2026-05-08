import { redirect } from "next/navigation";

type WritingSlugRedirectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WritingSlugRedirectPage({ params }: WritingSlugRedirectPageProps) {
  const { slug } = await params;
  redirect(`/blogs/${slug}`);
}