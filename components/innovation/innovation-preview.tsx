import { ArrowDown, ArrowRight, ScenarioMark } from "@/components/arkez-icons";
import { innovationPath } from "@/lib/innovation";
import { InnovationArtwork } from "./hub-visuals";
import { PortfolioLab } from "./portfolio-lab";
import { TopicExplorer } from "./topic-explorer";

export function InnovationPreview() {
  return (
    <section className="hub-preview" id="innovacion" aria-labelledby="innovation-heading">
      <div className="hub-intro">
        <div className="container-shell hub-hero-layout">
          <div className="hub-copy" data-reveal>
            <p className="eyebrow">Arkez Innovation Hub</p>
            <h2 id="innovation-heading">Innovación y oportunidades <em>en el futuro de las inversiones</em></h2>
            <p>Explora cómo la inteligencia artificial, los activos digitales y las nuevas tecnologías están transformando los mercados y creando nuevas formas de aprender, analizar e invertir.</p>
            <div className="hub-actions">
              <a className="button button-gold" href={innovationPath}>Conoce Innovation Hub<ArrowRight size={17} aria-hidden="true" /></a>
              <a className="hub-light-link" href="#explorar-innovacion">Explorar tecnologías<ArrowDown size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <InnovationArtwork />
        </div>
      </div>

      <section className="hub-discover" id="explorar-innovacion" aria-labelledby="innovation-discover-title">
        <div className="container-shell">
          <div className="hub-editorial-heading" data-reveal>
            <h3 id="innovation-discover-title">Descubre las tecnologías que están transformando las finanzas</h3>
            <p>Explora cada tema para ver cómo funciona y qué conviene verificar.</p>
          </div>
          <TopicExplorer />
        </div>
      </section>

      <section className="hub-practice" id="practicar-innovacion" aria-labelledby="innovation-practice-title">
        <div className="container-shell">
          <div className="hub-editorial-heading" data-reveal>
            <h3 id="innovation-practice-title">Convierte la información financiera en decisiones mejor fundamentadas</h3>
            <p>Modifica el peso de los activos digitales y su variación para comparar el efecto de un mismo escenario en dos carteras.</p>
          </div>
          <PortfolioLab />
          <div className="hub-actions">
            <a className="button button-dark" href="/recursos/">Explorar la biblioteca<ArrowRight size={17} aria-hidden="true" /></a>
            <a className="hub-file-link" href="/recursos/archivos/laboratorio-financiero.xlsx" download><ScenarioMark size={18} aria-hidden="true" /> Descargar laboratorio (XLSX)</a>
          </div>
        </div>
      </section>
    </section>
  );
}
