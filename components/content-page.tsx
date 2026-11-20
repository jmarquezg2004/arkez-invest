import { ChevronDown, ChevronRight } from "lucide-react";
import type { ContentPage as PageData } from "@/lib/content";
import { pages } from "@/lib/content";
import { FeatureGrid } from "./feature-grid";

export function ContentPage({ page, path }: { page: PageData; path: string }) {
  const segments = path.split("/").filter(Boolean);
  const parents = segments.slice(0, -1).map((_, index) => `/${segments.slice(0, index + 1).join("/")}/`)
    .filter((route) => pages[route]);

  return (
    <>
      <section className="page-hero">
        <div className="container-shell">
          <nav aria-label="Ruta de navegación" className="breadcrumbs">
            <ol>
              <li><a href="/">Inicio</a></li>
              {parents.map((route) => (
                <li key={route}>
                  <ChevronRight size={14} aria-hidden="true" /><a href={route}>{pages[route].title}</a>
                </li>
              ))}
              <li><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">{page.title}</span></li>
            </ol>
          </nav>
          <p className="eyebrow">{page.group}</p>
          <h1>{page.title}</h1>
          <p className="page-intro">{page.description}</p>
        </div>
      </section>

      <div className="container-shell page-body">
        {page.sections && (
          <div className="content-sections">
            {page.sections.map(({ title, body }) => (
              <section key={title}><h2>{title}</h2><p>{body}</p></section>
            ))}
          </div>
        )}
        {page.cards && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="section-title mb-7">{page.sections ? "Más para explorar" : "Explora esta sección"}</h2>
            <FeatureGrid cards={page.cards} />
          </section>
        )}
        {page.faq && (
          <section aria-label="Preguntas y respuestas" className="faq-list">
            {page.faq.map(({ title, body }) => (
              <details key={title}>
                <summary>{title}<ChevronDown size={20} aria-hidden="true" /></summary>
                <p>{body}</p>
              </details>
            ))}
          </section>
        )}
        {page.next && <a className="button button-dark mt-9" href={page.next.href}>{page.next.label}</a>}
      </div>
    </>
  );
}
