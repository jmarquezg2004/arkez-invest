import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/navigation";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.ARKEZ_INDEXABLE === "1";
  return {
    rules: { userAgent: "*", ...(indexable ? { allow: "/" } : { disallow: "/" }) },
    ...(indexable ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
