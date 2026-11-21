import { ArrowRight } from "@/components/arkez-icons";
import { AiMap } from "./ai-map";
import { ExperienceHero } from "./hero";
import { ExperienceStory } from "./story";
import { LedgerDemo, PropertyDemo } from "./tools";

export function ArkezExperience() {
  return <div className="ax-experience">
    <ExperienceHero />
    <nav className="ax-subnav" aria-label="Explorar el prototipo">
      <div className="ax-shell"><a href="#recorrido">Recorrido</a><a href="#herramientas-arkez">Herramientas</a><a href="#mapa-ia">Mapa de IA</a></div>
    </nav>
    <ExperienceStory />
    <section className="ax-tools ax-shell" id="herramientas-arkez" aria-labelledby="ax-tools-title">
      <div className="ax-section-title"><div><p className="ax-kicker">Empieza y aplica</p><h2 id="ax-tools-title">Pon tus decisiones a prueba.</h2></div>
        <a className="ax-section-link" href="/herramientas/interes-compuesto/">Abrir la calculadora de interés compuesto <ArrowRight size={17} /></a>
      </div>
      <div className="ax-tools-grid"><LedgerDemo /><PropertyDemo /></div>
    </section>
    <AiMap />
    <div className="ax-shell ax-end"><a href="/">Volver al sitio actual</a><a href="/contacto/">Consultar a Arkez Invest</a></div>
  </div>;
}
