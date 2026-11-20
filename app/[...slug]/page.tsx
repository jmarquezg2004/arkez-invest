import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/content-page";
import { pages } from "@/lib/content";
import { siteName } from "@/lib/navigation";

type RouteProps = { params: Promise<{ slug: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(pages).map((path) => ({ slug: path.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const path = `/${(await params).slug.join("/")}/`;
  const page = pages[path];
  if (!page) notFound();

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${page.title} | ${siteName}`,
      description: page.description,
      url: path,
      type: "website",
      siteName,
      locale: "es",
    },
  };
}

export default async function RoutedPage({ params }: RouteProps) {
  const path = `/${(await params).slug.join("/")}/`;
  const page = pages[path];
  if (!page) notFound();
  return <ContentPage page={page} path={path} />;
}
