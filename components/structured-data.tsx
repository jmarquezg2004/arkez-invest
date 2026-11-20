import { breadcrumbs } from "@/lib/breadcrumbs";
import type { ContentPage } from "@/lib/content";
import { serviceHref, siteDescription, siteName, siteUrl } from "@/lib/navigation";
import { resources } from "@/lib/library";
import { socialImage } from "@/lib/seo";
import { services } from "@/lib/services";

const organization = { "@id": `${siteUrl}/#organizacion` };

const siteEntities = [
  {
    "@type": "Organization",
    ...organization,
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    logo: `${siteUrl}/brand/logo.png`,
  },
  {
    "@type": "WebSite",
    "@id": `${siteUrl}/#sitio`,
    name: siteName,
    url: siteUrl,
    inLanguage: "es",
    publisher: organization,
  },
];

export function StructuredData({ path, page }: { path: string; page?: ContentPage }) {
  const graph: Record<string, unknown>[] = [...siteEntities];

  if (page) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs(path).map(({ href, label }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: label,
        item: `${siteUrl}${href}`,
      })),
    });
  }

  const featured = path === "/servicios/" ? services : services.filter((service) => serviceHref(service.id) === path);
  graph.push(...featured.map((service) => ({
    "@type": "Service",
    "@id": `${siteUrl}${serviceHref(service.id)}#servicio`,
    name: service.title,
    description: service.body,
    url: `${siteUrl}${serviceHref(service.id)}`,
    provider: organization,
  })));

  if (path === "/recursos/") {
    graph.push({
      "@type": "ItemList",
      name: "Biblioteca de recursos financieros",
      itemListElement: resources.map((resource, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: resource.title,
          description: resource.description,
          url: `${siteUrl}${resource.read}`,
          inLanguage: "es",
          ...(resource.file && {
            encoding: {
              "@type": "MediaObject",
              contentUrl: `${siteUrl}${resource.file.href}`,
              encodingFormat: resource.file.format === "PDF" ? "application/pdf" : "text/csv",
            },
          }),
        },
      })),
    });
  }

  if (page?.editorial) {
    graph.push({
      "@type": "Article",
      "@id": `${siteUrl}${path}#articulo`,
      headline: page.title,
      description: page.description,
      author: organization,
      publisher: organization,
      mainEntityOfPage: `${siteUrl}${path}`,
      dateModified: page.editorial.updated,
      inLanguage: "es",
      image: `${siteUrl}${socialImage.url}`,
      citation: page.editorial.sources.map(({ href }) => href),
    });
  }

  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
