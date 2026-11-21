import { AllocationMark, ChainMark, EducationMark, MarketMark, TechnologyMark } from "@/components/arkez-icons";
import { CommercialOffer } from "@/components/commercial-offer";
import { CompoundCalculator } from "@/components/compound-calculator";
import { InnovationPreview } from "@/components/innovation/innovation-preview";
import { LearningLab } from "@/components/learning-lab";
import { offers } from "@/lib/commercial-offers";
import { ecosystemSections, editorialNews, investorCalculator, newsSections } from "@/lib/external-directory";
import { calculatorLink, innovationLink } from "@/lib/navigation";

const directoryIcons = [MarketMark, ChainMark, TechnologyMark, EducationMark];
const newsIcons = [MarketMark, TechnologyMark, EducationMark];
const newsDate = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function CommercialPages({ path }: { path: string }) {
  if (path === "/servicios/") return (
    <section aria-labelledby="commercial-services-heading">
      <h2 id="commercial-services-heading" className="section-title">Elige por dónde empezar</h2>
      <ul className="commercial-offer-list" role="list">
        {offers.slice(0, 3).map(({ id, href, title, summary }) => (
          <li key={href} id={id}><h3><a href={href}>{title}</a></h3><p>{summary}</p></li>
        ))}
      </ul>
    </section>
  );

  if (path === "/herramientas/") return (
    <>
      <section className="tools-starter" aria-labelledby="tools-calc-heading">
        <div><h2 id="tools-calc-heading">Calculadora de interés compuesto</h2>
          <p>Calcula cuánto podrías acumular con tus aportes. Cambia el plazo o la tasa y compara dos escenarios.</p></div>
        <a className="button button-dark" href={calculatorLink.href}>Probar calculadora</a>
      </section>
      <section className="tools-laboratory" id="laboratorio" aria-labelledby="tools-lab-heading">
        <div className="experience-section-heading">
          <h2 id="tools-lab-heading">Laboratorio financiero</h2>
          <p>Cuatro ejercicios para practicar con datos ilustrativos. Cambia un supuesto y observa el resultado.</p>
        </div>
        <LearningLab />
      </section>
      <InnovationPreview />
    </>
  );

  if (path === calculatorLink.href) return (
    <>
      <CompoundCalculator />
      <section className="tools-starter" aria-labelledby="compound-reference">
        <div>
          <h2 id="compound-reference">Consulta otra calculadora</h2>
          <p>Investor.gov es el sitio educativo de la Comisión de Bolsa y Valores de Estados Unidos (SEC).</p>
        </div>
        <a className="button button-outline" href={investorCalculator}>Abrir calculadora de Investor.gov en español</a>
      </section>
    </>
  );

  if (path === "/actualidad/" || path === "/ecosistema/") {
    const isNews = path === "/actualidad/";
    const groups = isNews ? newsSections : ecosystemSections;
    return (
      <>
        <nav className="directory-nav" aria-label={isNews ? "Categorías de actualidad" : "Categorías del ecosistema"}>
          {groups.map(({ id, title }) => <a key={id} href={`#${id}`}>{title}</a>)}
        </nav>
        <div className="directory-sections">
          {groups.map(({ id, title, sources }, index) => {
            const Icon = (isNews ? newsIcons : directoryIcons)[index];
            const entry = isNews && id in editorialNews ? editorialNews[id as keyof typeof editorialNews] : null;
            return (
              <section key={id} id={id} aria-labelledby={`directory-${id}`}>
                <h2 id={`directory-${id}`}><Icon size={24} />{title}</h2>
                {entry && (
                  <article className="directory-reading">
                    <h3><a href={entry.href}>{entry.title}</a></h3>
                    <p>{entry.source} · <time dateTime={entry.date}>{newsDate.format(new Date(entry.date))}</time></p>
                  </article>
                )}
                <ul role="list">
                  {sources.map(({ name, description, href }) => (
                    <li key={href}><h3><a href={href}>{name}</a></h3><p>{description}</p></li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
        {isNews
          ? <p className="directory-note">Selección editorial de publicaciones externas y secciones oficiales que puedes seguir. <a href="/recursos/articulos/">Leer artículos de Arkez</a>.</p>
          : <p className="directory-note">Directorio informativo, sin afiliación ni recomendación comercial. Revisa la edad mínima, las condiciones y la disponibilidad en tu país en el sitio de cada entidad. <a href={innovationLink.href}>Explorar el Innovation Hub</a>.</p>}
      </>
    );
  }

  if (path === "/recursos/") return (
    <section className="tools-starter resource-tool" aria-labelledby="resource-tool-heading">
      <div><h2 id="resource-tool-heading"><AllocationMark size={23} /> Calculadora de interés compuesto</h2>
        <p>Prueba diferentes montos y plazos antes de planear tu próxima meta de ahorro.</p></div>
      <a className="button button-dark" href={calculatorLink.href}>Probar calculadora</a>
    </section>
  );

  return <CommercialOffer path={path} />;
}
