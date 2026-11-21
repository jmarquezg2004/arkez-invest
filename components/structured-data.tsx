import { breadcrumbs } from "@/lib/breadcrumbs";
import type { ContentPage } from "@/lib/content";
import { calculatorLink, ecosystemLink, newsLink, serviceHref, siteDescription, siteName, siteUrl } from "@/lib/navigation";
import { ecosystemSections, editorialNews } from "@/lib/external-directory";
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
      itemListElement: breadcrumbs(path, page.title).map(({ href, label }, index) => ({
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
          dateModified: resource.updated,
          ...(resource.cover && { thumbnailUrl: `${siteUrl}${resource.cover}` }),
          ...(resource.file && {
            encoding: {
              "@type": "MediaObject",
              contentUrl: `${siteUrl}${resource.file.href}`,
              encodingFormat: resource.file.mime,
            },
          }),
        },
      })),
    });
  }

  if (path === calculatorLink.href) {
    graph.push({
      "@type": "WebApplication",
      name: calculatorLink.label,
      url: `${siteUrl}${path}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "es",
      isAccessibleForFree: true,
      publisher: organization,
    });
  }

  if (path === newsLink.href || path === ecosystemLink.href) {
    const items = path === newsLink.href
      ? Object.values(editorialNews).map(({ title, href }) => ({ name: title, href }))
      : ecosystemSections.flatMap(({ sources }) => sources.map(({ name, href }) => ({ name, href })));
    graph.push({
      "@type": "ItemList",
      name: page?.title,
      itemListElement: items.map(({ name, href }, index) => ({
        "@type": "ListItem", position: index + 1, name, url: href,
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
