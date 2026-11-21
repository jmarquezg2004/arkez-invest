import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommercialPages } from "@/components/commercial-pages";
import { ContentPage } from "@/components/content-page";
import { pages } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";

type RouteProps = { params: Promise<{ slug: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(pages).filter((path) => path !== "/contacto/" && path !== "/recursos/").map((path) => ({ slug: path.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const path = `/${(await params).slug.join("/")}/`;
  const page = pages[path];
  if (!page) notFound();

  return pageMetadata(path, page.editorial);
}

export default async function RoutedPage({ params }: RouteProps) {
  const path = `/${(await params).slug.join("/")}/`;
  const page = pages[path];
  if (!page) notFound();
  return (
    <>
      <StructuredData page={page} path={path} />
      <ContentPage page={page} path={path}><CommercialPages path={path} /></ContentPage>
    </>
  );
}
