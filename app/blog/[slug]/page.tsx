import { redirect } from "next/navigation";

type BlogSlugRedirectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogSlugRedirectPage({ params }: BlogSlugRedirectPageProps) {
  const { slug } = await params;
  redirect(`/writing/${slug}`);
}