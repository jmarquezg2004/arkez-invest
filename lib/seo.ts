import type { Metadata } from "next";
import { siteName, siteUrl } from "./navigation";
import { seoData } from "./seo-data";

export const socialImage = {
  url: "/brand/share.png",
  width: 1200,
  height: 630,
  alt: "Arkez Invest, educación, formación y consultoría financiera",
};

export function pageMetadata(path: string, article?: { updated: string }): Metadata {
  const { title, description } = seoData[path];
  const social = { title, description, url: path, siteName, locale: "es", images: [socialImage] };

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: article
      ? { ...social, type: "article", modifiedTime: article.updated, authors: [`${siteUrl}/nosotros/`] }
      : { ...social, type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [socialImage] },
  };
}
