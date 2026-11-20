import type { MetadataRoute } from "next";
import { pages } from "@/lib/content";
import { siteUrl } from "@/lib/navigation";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...Object.keys(pages)].map((path) => ({ url: `${siteUrl}${path}` }));
}
