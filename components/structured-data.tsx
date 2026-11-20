import { breadcrumbs } from "@/lib/breadcrumbs";
import type { ContentPage } from "@/lib/content";
import { siteDescription, siteName, siteUrl } from "@/lib/navigation";
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

  if (path === "/servicios/" || path === "/servicios/educacion-financiera/") {
    const featured = path === "/servicios/" ? services : [services[0]];
    graph.push(...featured.map((service) => ({
      "@type": "Service",
      "@id": `${siteUrl}/servicios/#${service.id}`,
      name: service.title,
      description: service.body,
      url: service.id === "educacion-financiera"
        ? `${siteUrl}/servicios/educacion-financiera/`
        : `${siteUrl}/servicios/#${service.id}`,
      provider: organization,
    })));
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
