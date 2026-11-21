import { AllocationMark, ArrowDown, ArrowRight, ChainMark, EducationMark, InsightMark, MarketMark, TechnologyMark } from "@/components/arkez-icons";
import { Brand } from "@/components/brand";
import { PortfolioLab } from "@/components/innovation/portfolio-lab";
import { innovationTopics } from "@/lib/innovation";
import { prototypeDirections, prototypePath, type PrototypeDirection, type PrototypeView } from "@/lib/prototype-routes";
import { PrototypeAtlas } from "./prototype-atlas";
import { PrototypeDesk } from "./prototype-desk";

const editorialMarks = [AllocationMark, ChainMark, InsightMark, EducationMark, TechnologyMark];
const hubIntro = "Explora cómo se relacionan el análisis de mercados, la tecnología y el riesgo a través de casos prácticos.";

function PrototypeNav({ direction, view }: { direction: PrototypeDirection; view: PrototypeView }) {
  const alternate = direction === "editorial" ? "interactiva" : "editorial";
  return <header className="proto-header">
    <div className="proto-wrap proto-header-inner">
      <Brand inverted={direction === "interactiva"} />
      <nav aria-label="Navegación del prototipo">
        <a aria-current={view === "portada" ? "page" : undefined} href={prototypePath(direction)}>Portada</a>
        <a aria-current={view === "innovacion" ? "page" : undefined} href={prototypePath(direction, "innovacion")}>Innovation Hub</a>
        <a className="proto-switch" href={prototypePath(alternate, view)}>Ver propuesta {prototypeDirections[alternate].letter}<ArrowRight size={15} /></a>
      </nav>
    </div>
  </header>;
}

function EditorialHero({ hub }: { hub: boolean }) {
  return <section className={`editorial-hero ${hub ? "editorial-hub-hero" : ""}`}>
    <div className="proto-wrap editorial-hero-layout">
      <div className="editorial-intro">
        <p className="proto-kicker">{hub ? "Innovation Hub" : "Educación, formación y consultoría"}</p>
        {hub
          ? <h1>La innovación, <em>vista en detalle.</em></h1>
          : <h1>Conocimiento financiero <em>para tomar mejores decisiones.</em></h1>}
        <p className="proto-description">{hub ? hubIntro : "Formación, análisis de mercados y herramientas para fortalecer tus capacidades financieras y de inversión."}</p>
        <div className="proto-actions">
          <a className="proto-button" href={hub ? "#capitulos" : "#caso"}>{hub ? "Leer los capítulos" : "Explorar un caso"}<ArrowDown size={17} /></a>
          <a className="proto-text-link" href={hub ? "#simulador" : prototypePath("editorial", "innovacion")}>{hub ? "Ir al simulador" : "Innovation Hub"}<ArrowRight size={16} /></a>
        </div>
      </div>
      <figure className="editorial-figure">
        <div className="editorial-image">
          {hub
            ? <img src="/brand/estudio-540.webp" width="540" height="675" alt="" fetchPriority="high" />
            : <img src="/prototipos/editorial-760.webp" srcSet="/prototipos/editorial-480.webp 480w, /prototipos/editorial-760.webp 760w, /prototipos/editorial-1100.webp 1100w"
                sizes="(max-width: 720px) 94vw, 51vw" width="760" height="633" alt="" fetchPriority="high" />}
        </div>
        <figcaption><span>{hub ? "Del estudio al criterio" : "Estudio de luz, vidrio y piedra"}</span><span>{hub ? "Arkez Innovation Hub" : "Ilustración editorial"}</span></figcaption>
      </figure>
    </div>
  </section>;
}

function EditorialChapters() {
  return <section className="proto-wrap editorial-chapters" id="capitulos" aria-labelledby="editorial-contents">
    <div className="editorial-chapter-index">
      <p className="proto-kicker">Guía de lectura</p>
      <h2 id="editorial-contents">Cinco temas para investigar</h2>
      <nav aria-label="Índice de capítulos">
        {innovationTopics.map(({id,short}) => <a key={id} href={`#${id}`}>{short}<ArrowRight size={15} /></a>)}
      </nav>
    </div>
    <div>
      {innovationTopics.map(({id,title,explanation,example,risk,steps,visual,resource}, index) => {
        const Mark = editorialMarks[index];
        return <article key={id} id={id} className="editorial-chapter">
          <Mark size={31} />
          <h3>{title}</h3><p>{explanation}</p>
          <figure><figcaption>{visual}</figcaption><ol>
            {steps.map((step) => <li key={step}>{step}</li>)}
          </ol></figure>
          <details><summary>Ejemplo y riesgos</summary><p>{example}</p><p>{risk}</p></details>
          <a className="proto-text-link" href={resource.href}>{resource.label}<ArrowRight size={16} /></a>
        </article>;
      })}
    </div>
  </section>;
}

function CaseSection({ direction, hub }: { direction: PrototypeDirection; hub: boolean }) {
  return <section className="proto-case" id={hub ? "simulador" : "caso"} aria-labelledby="proto-case-title">
    <div className="proto-wrap">
      <div className="case-heading">
        <p className="proto-kicker">Caso práctico</p>
        <h2 id="proto-case-title">Un cambio. Dos resultados.</h2>
        <p>Ajusta el peso y la variación de los activos digitales. Compara las dos carteras y revisa qué explica la diferencia.</p>
      </div>
      <PortfolioLab />
      <a className="proto-text-link" href={hub ? "/recursos/" : prototypePath(direction, "innovacion")}>
        {hub ? "Consultar recursos de aprendizaje" : "Seguir hacia Innovation Hub"}<ArrowRight size={17} />
      </a>
    </div>
  </section>;
}

function InteractiveHero({ hub }: { hub: boolean }) {
  return <section className={`interactive-hero ${hub ? "interactive-hub-hero" : ""}`}>
    <div className="proto-wrap interactive-hero-layout">
      <div className="interactive-intro">
        <p className="proto-kicker">{hub ? "Arkez Innovation Hub" : "Educación financiera aplicada"}</p>
        {hub ? <h1>Del dato al <em>criterio.</em></h1> : <h1>Conocimiento financiero para tomar <em>mejores decisiones.</em></h1>}
        <p className="proto-description">{hub ? hubIntro : "Prueba un supuesto, observa qué cambia y aprende a explicar el resultado."}</p>
        <div className="proto-actions">
          <a className="proto-button" href={hub ? "#investigar" : "#consola"}>{hub ? "Iniciar recorrido" : "Probar el laboratorio"}<ArrowDown size={17} /></a>
          <a className="proto-text-link" href={hub ? "#simulador" : prototypePath("interactiva", "innovacion")}>{hub ? "Ir al simulador" : "Innovation Hub"}<ArrowRight size={16} /></a>
        </div>
      </div>
      {hub ? <figure className="interactive-map">
        <figcaption>Del mercado a la decisión</figcaption>
        <svg viewBox="0 0 500 280" aria-hidden="true" className="map-lines">
          <path className="atlas-grid" d="M45 32v212M140 32v212M250 32v212M360 32v212M450 32v212M45 53h405M45 139h405M45 222h405"/>
          <path className="map-trace" d="M45 222 106 183 158 191 211 125H318L384 53h66" pathLength="1"/>
          <path className="map-muted" d="M211 125Q252 125 285 185H450M318 125Q367 125 384 96H450"/>
          <circle cx="211" cy="125" r="7" className="map-checkpoint"/><circle cx="384" cy="53" r="7" className="map-checkpoint"/>
        </svg>
        <ol><li>Señal</li><li>Verificación</li><li>Escenario</li></ol>
      </figure> : <div id="consola"><PrototypeDesk /></div>}
    </div>
  </section>;
}

export function PrototypePage({ direction, view }: { direction: PrototypeDirection; view: PrototypeView }) {
  const hub = view === "innovacion";
  const design = prototypeDirections[direction];
  return <div className="proto" data-direction={direction} data-view={view}>
    <link rel="stylesheet" href="/prototipos/preview.css" precedence="arkez-prototype" />
    <PrototypeNav direction={direction} view={view} />
    {direction === "editorial" ? <EditorialHero hub={hub} /> : <InteractiveHero hub={hub} />}
    {hub && (direction === "editorial" ? <EditorialChapters /> : (
      <section id="investigar" className="proto-wrap atlas-section" aria-labelledby="atlas-heading">
        <div className="case-heading"><p className="proto-kicker">Recorrido interactivo</p><h2 id="atlas-heading">Sigue la señal.</h2><p>Desplázate por los cinco temas o selecciona uno en la visualización.</p></div>
        <PrototypeAtlas />
      </section>
    ))}
    {!hub && direction === "editorial" && (
      <section className="proto-wrap editorial-quote">
        <MarketMark size={34} />
        <h2>Leer una cifra<br />también es saber preguntarle.</h2>
        <p>¿Cuál es la fuente? ¿Qué supuesto sostiene el resultado? ¿Qué cambia si el escenario es distinto?</p>
      </section>
    )}
    <CaseSection direction={direction} hub={hub} />
    <footer className="proto-footer">
      <div className="proto-wrap"><span>Arkez Invest · Propuesta {design.letter} · {design.name}</span><a href={hub ? prototypePath(direction) : "/"}>{hub ? "Volver a la portada de la propuesta" : "Volver al sitio de Arkez"}</a></div>
    </footer>
  </div>;
}
