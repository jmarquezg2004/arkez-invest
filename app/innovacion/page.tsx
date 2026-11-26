import { ArrowRight, ChevronDown, ChevronRight } from "@/components/arkez-icons";
import { StructuredData } from "@/components/structured-data";
import { RevealSections } from "@/components/reveal-sections";
import { InnovationArtwork, TopicDiagram } from "@/components/innovation/hub-visuals";
import { InvestmentJourney } from "@/components/innovation/investment-journey";
import { PortfolioLab } from "@/components/innovation/portfolio-lab";
import { innovationDescription, innovationFaq, innovationPath, innovationSources, innovationTitle, innovationTopics, innovationUpdated } from "@/lib/innovation";
import { pageMetadata } from "@/lib/seo";

const editorial = { updated: innovationUpdated, sources: innovationSources };
const page = { title: innovationTitle, description: innovationDescription, group: "Innovación", editorial };
export const metadata = pageMetadata(innovationPath, editorial);

export default function InnovationPage() {
  return (
    <>
      <StructuredData path={innovationPath} page={page} />
      <RevealSections />
      <div className="hub-intro hub-page-intro">
        <div className="container-shell">
          <nav className="breadcrumbs" aria-label="Ruta de navegación">
            <ol><li><a href="/">Inicio</a></li><li><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">Innovación</span></li></ol>
          </nav>
          <div className="hub-hero-layout">
            <div className="hub-copy">
              <p className="eyebrow">Arkez Innovation Hub</p>
              <h1>{innovationTitle}</h1>
              <p>Para evaluar una tecnología financiera, empieza por los derechos que representa, los supuestos que usa y lo que puede fallar. Esta guía reúne cinco temas, con ejemplos para practicar esa evaluación.</p>
              <a className="hub-light-link journey-anchor" href="#trayectoria">Recorrer el caso ilustrativo<ArrowRight size={16} aria-hidden="true" /></a>
              <p className="hub-byline">Por <a href="/nosotros/">Arkez Invest</a> · Actualizado el <time dateTime={innovationUpdated}>20 de noviembre de 2026</time></p>
            </div>
            <InnovationArtwork priority />
          </div>
        </div>
      </div>
      <InvestmentJourney />
      <div className="hub-guide">
        <div className="container-shell hub-guide-layout">
          <nav aria-label="Temas de innovación" className="hub-guide-nav">
            <ul role="list">
              {innovationTopics.map((topic) => <li key={topic.id}><a href={`#${topic.id}`}>{topic.title}<ChevronRight size={16} aria-hidden="true" /></a></li>)}
              <li><a href="#simulador">Simulador de carteras<ChevronRight size={16} aria-hidden="true" /></a></li>
            </ul>
          </nav>
          <div className="hub-guide-content">
            {innovationTopics.map((topic) => (
              <section id={topic.id} className="hub-guide-topic" key={topic.id}>
                <p className="eyebrow" data-reveal>{topic.short}</p>
                <h2>{topic.title}</h2>
                <p>{topic.explanation}</p>
                <TopicDiagram topic={topic} />
                <div className="hub-guide-example">
                  <div><h3>Ejemplo práctico</h3><p>{topic.example}</p></div>
                  <div><h3>Riesgos y límites</h3><p>{topic.risk}</p></div>
                </div>
                <a href={topic.resource.href}>{topic.resource.label}<ArrowRight size={17} aria-hidden="true" /></a>
              </section>
            ))}
          </div>
        </div>
      </div>
      <section id="simulador" className="hub-practice" aria-labelledby="innovation-lab-title">
        <div className="container-shell">
          <div className="hub-editorial-heading" data-reveal>
            <h2 id="innovation-lab-title">Un mismo escenario, dos portafolios</h2>
            <p>Usa este ejercicio para responder una pregunta: ¿cuánto puede cambiar el resultado total por una posición pequeña? Mantén fijo el choque, compara dos pesos y anota qué exposición explica la diferencia.</p>
          </div>
          <PortfolioLab />
        </div>
      </section>
      <section className="container-shell hub-faq" aria-labelledby="innovation-faq">
        <h2 id="innovation-faq">Preguntas frecuentes</h2>
        <div className="faq-list">
          {innovationFaq.map(({ question, answer }) => <details key={question}>
            <summary><h3>{question}</h3><ChevronDown size={18} aria-hidden="true" /></summary>
            <p>{answer}</p>
          </details>)}
        </div>
      </section>
      <section className="hub-resources" aria-labelledby="innovation-sources">
        <div className="container-shell hub-source-layout">
          <div>
            <h2 id="innovation-sources">Fuentes consultadas</h2>
            <ul className="reading-links" role="list">{innovationSources.map((source) => <li key={source.href}><a href={source.href}>{source.label}</a></li>)}</ul>
          </div>
          <div>
            <h2>Continúa explorando</h2>
            <ul className="reading-links" role="list">
              <li><a href="/recursos/">Biblioteca de recursos financieros</a></li>
              <li><a href="/recursos/guias/primeros-pasos/">Guía para empezar a invertir</a></li>
              <li><a href="/servicios/formacion-practica/">Formación práctica en inversiones</a></li>
              <li><a href="/recursos/archivos/laboratorio-financiero.xlsx" download>Descargar laboratorio (XLSX)</a></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
