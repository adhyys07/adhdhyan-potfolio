import { redirect } from "next/navigation";

export default function RssRedirectPage() {
  redirect("/rss.xml");
}
