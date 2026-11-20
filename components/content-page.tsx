import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { breadcrumbs } from "@/lib/breadcrumbs";
import type { ContentPage as PageData } from "@/lib/content";
import { siteName, type SiteLink } from "@/lib/navigation";
import { FeatureGrid } from "./feature-grid";
import { ResourceTranscript } from "./resource-transcript";

function ReadingLinks({ links }: { links: readonly SiteLink[] }) {
  return <ul className="reading-links" role="list">
    {links.map(({ href, label }) => <li key={href}><a href={href}>{label}</a></li>)}
  </ul>;
}

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
});

export function ContentPage({ page, path, children }: { page: PageData; path: string; children?: ReactNode }) {
  const trail = breadcrumbs(path);
  const Body = page.editorial ? "article" : "div";

  return (
    <>
      <section className="page-hero">
        <div className="container-shell">
          <nav aria-label="Ruta de navegación" className="breadcrumbs">
            <ol>
              {trail.slice(0, -1).map(({ href, label }, index) => (
                <li key={href}>
                  {index > 0 && <ChevronRight size={14} aria-hidden="true" />}
                  <a href={href}>{label}</a>
                </li>
              ))}
              <li><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">{page.title}</span></li>
            </ol>
          </nav>
          <p className="eyebrow">{page.group}</p>
          <h1 id="page-title">{page.title}</h1>
          <p className="page-intro">{page.description}</p>
        </div>
      </section>

      <Body className="container-shell page-body" aria-labelledby={page.editorial ? "page-title" : undefined}>
        {page.editorial && (
          <p className="editorial-byline">
            Por <a href="/nosotros/">{siteName}</a> · Actualizado el{" "}
            <time dateTime={page.editorial.updated}>{dateFormat.format(new Date(page.editorial.updated))}</time>
          </p>
        )}
        {children}
        {page.sections && (
          <div className="content-sections">
            {page.sections.map(({ id, title, body, topics, links, preview, edition }) => (
              <section key={title} id={id}>
                <h2>{title}</h2>
                <p>{body}</p>
                {topics?.map((topic) => (
                  <div className="content-topic" key={topic.title}>
                    <h3>{topic.title}</h3>
                    <p>{topic.body}</p>
                  </div>
                ))}
                {preview && <figure className="resource-preview">
                  <img src={preview.href} alt={preview.alt} width={preview.width} height={preview.height} loading="lazy" />
                  <figcaption>Vista del Dashboard con datos ficticios. El libro incluye campos para tus propios escenarios.</figcaption>
                </figure>}
                {links && <ReadingLinks links={links} />}
                {edition && <ResourceTranscript slug={edition} />}
              </section>
            ))}
          </div>
        )}
        {page.editorial && (
          <section className="editorial-sources" aria-labelledby="sources-title">
            <h2 id="sources-title">Fuentes consultadas</h2>
            <ReadingLinks links={page.editorial.sources} />
          </section>
        )}
        {page.cards && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="section-title mb-7">{page.sections ? "Más para explorar" : "Explora esta sección"}</h2>
            <FeatureGrid cards={page.cards} />
          </section>
        )}
        {page.faq && (
          <section aria-labelledby="answers-title" className="faq-section">
            <h2 id="answers-title">Preguntas y respuestas</h2>
            <div className="faq-list">
              {page.faq.map(({ title, body }) => (
                <details key={title}>
                  <summary><h3>{title}<ChevronDown size={20} aria-hidden="true" /></h3></summary>
                  <p>{body}</p>
                </details>
              ))}
            </div>
          </section>
        )}
        {page.next && <a className="button button-dark mt-9" href={page.next.href}>{page.next.label}</a>}
      </Body>
    </>
  );
}
