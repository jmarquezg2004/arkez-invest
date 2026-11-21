import { AllocationMark, BusinessMark, ChainMark, EducationMark, InsightMark, MarketMark, MoveUpRight, TechnologyMark } from "@/components/arkez-icons";
import { ecosystemSections, editorialNews } from "@/lib/external-directory";
import { PremiumDashboard } from "./dashboard";
import { PremiumGrowth } from "./growth";
import { PremiumServices } from "./services";
import { PremiumStory } from "./story";
import { PremiumToolDock } from "./tool-dock";

const marks = [
  [EducationMark, "Formación"], [MarketMark, "Mercados"], [BusinessMark, "Caja"],
  [AllocationMark, "Carteras"], [InsightMark, "Análisis"], [ChainMark, "Tokenización"],
] as const;

const date = new Intl.DateTimeFormat("es-CO",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"});

export function PremiumShowcase() {
  return <div className="px-showcase">
    <section className="px-hero" aria-labelledby="px-title">
      <div className="px-shell px-hero-layout">
        <div className="px-hero-copy">
          <p className="px-kicker">Showcase de diseño · Arkez Invest</p>
          <h1 id="px-title">Decide con <em>perspectiva.</em></h1>
          <p>Cambia una variable y observa qué cambia contigo. Explora cómo podrían verse las herramientas educativas de Arkez.</p>
          <div className="px-actions"><a href="#proyeccion">Probar la calculadora</a><a href="#ofertas">Explorar servicios</a></div>
        </div>
        <section className="px-device" id="dashboard" aria-label="Dashboard de escenarios y distribución">
          <PremiumDashboard />
        </section>
      </div>
    </section>

    <nav className="px-index" aria-label="Secciones de la demostración">
      <div className="px-shell"><a href="#dashboard">Escenarios</a><a href="#ofertas">Servicios</a><a href="#herramientas-demo">Herramientas</a><a href="#proyeccion">Proyección</a><a href="#recorrido">Recorrido</a><a href="#iconografia">Iconos</a><a href="#lecturas">Actualidad</a></div>
    </nav>

    <section id="ofertas" className="px-shell px-section" aria-labelledby="px-services-title">
      <div className="px-section-intro"><h2 id="px-services-title">Aprende haciendo.</h2><p>Elige el ejercicio que se parece a la decisión que tienes delante.</p></div>
      <PremiumServices />
    </section>

    <section id="herramientas-demo" className="px-shell px-section px-tool-section" aria-labelledby="px-tools-title">
      <div className="px-section-intro"><h2 id="px-tools-title">Dos formas de practicar.</h2><p>Proyecta una meta de ahorro o compara el efecto de un escenario en dos carteras.</p></div>
      <PremiumToolDock />
    </section>

    <section id="proyeccion" className="px-calculator px-section" aria-labelledby="px-growth-title">
      <div className="px-shell">
        <div className="px-section-intro">
          <div><p className="px-kicker">Interés compuesto</p><h2 id="px-growth-title">Dale tiempo a tu ahorro.</h2></div>
          <p>Haz el mismo recorrido con y sin una tasa de ejemplo. Consulta el aporte y el crecimiento de cada año.</p>
        </div>
        <PremiumGrowth />
      </div>
    </section>

    <section id="recorrido" className="px-story px-section" aria-labelledby="px-story-title">
      <div className="px-shell">
        <div className="px-section-intro"><h2 id="px-story-title">De una meta a una decisión.</h2><p>Tres pasos para poder explicar por qué cambió un resultado.</p></div>
        <PremiumStory />
      </div>
    </section>

    <section id="iconografia" className="px-shell px-section" aria-labelledby="px-icons-title">
      <div className="px-section-intro"><h2 id="px-icons-title">Una señal para cada tarea.</h2><p>Capas, siluetas y detalles dorados distinguen los conceptos, incluso en pantallas pequeñas.</p></div>
      <ul className="px-icons" role="list">
        {marks.map(([Icon,label]) => <li key={label}><span className="px-medallion"><Icon size={31} /></span><strong>{label}</strong></li>)}
      </ul>
    </section>

    <section id="lecturas" className="px-editorial px-section" aria-labelledby="px-news-title">
      <div className="px-shell">
        <div className="px-section-intro"><h2 id="px-news-title">Para seguir explorando.</h2><a className="px-text-link" href="/actualidad/">Ver Actualidad</a></div>
        <div className="px-editorial-layout">
          <div className="px-editorial-feature">
            <img src="/recursos/portadas/primeros-pasos-para-invertir.webp" loading="lazy" width="240" height="340" alt="" />
            <div><p className="px-kicker">Guía de Arkez</p><h3>Primeros pasos para invertir</h3><a href="/recursos/guias/primeros-pasos/">Leer la guía<MoveUpRight size={17} /></a></div>
          </div>
          <ul className="px-articles" role="list">
            {Object.values(editorialNews).map(({ title, date: published, href, source }) => <li key={href}>
              <p>{source} · <time dateTime={published}>{date.format(new Date(published))}</time></p>
              <h3><a href={href}>{title}<MoveUpRight size={17} /></a></h3>
            </li>)}
          </ul>
        </div>
        <div className="px-platform-heading"><h3>Plataformas y fuentes</h3><a className="px-text-link" href="/ecosistema/">Consultar el directorio</a></div>
        <ul className="px-platforms" role="list">
          {ecosystemSections.map(({id,title,sources:[source]},i) => {
            const Mark=[MarketMark,ChainMark,TechnologyMark,EducationMark][i];
            return <li key={id}><a href={source.href}><Mark size={23} /><span><strong>{source.name}</strong><small>{title}</small></span><MoveUpRight size={15} /></a></li>;
          })}
        </ul>
      </div>
    </section>
    <div className="px-shell px-end"><a href="/">Volver a la web actual</a><a href="/contacto/">Consultar a Arkez</a></div>
  </div>;
}
