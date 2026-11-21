import { ArrowRight, EducationMark } from "@/components/arkez-icons";
import { AiMap } from "./ai-map";
import { ExperienceHero, ExperiencePaths } from "./hero";
import { ExperienceSectionNav } from "./section-nav";
import { ExperienceStory } from "./story";
import { LedgerDemo, PropertyDemo } from "./tools";

export function ArkezExperience() {
  return <div className="ax-experience">
    <ExperienceHero />
    <ExperienceSectionNav />
    <ExperiencePaths />
    <section className="ax-tools ax-shell" id="herramientas-arkez" aria-labelledby="ax-tools-title">
      <div className="ax-section-title"><div><p className="ax-kicker">Empieza y aplica</p><h2 id="ax-tools-title">Pon tus decisiones a prueba.</h2></div>
        <p>Prueba los controles con ejemplos y revisa cómo cambian los resultados.</p>
      </div>
      <a className="ax-calculator-link" href="/herramientas/interes-compuesto/">
        <EducationMark size={25} /><span><strong>Interés compuesto</strong><small>Proyecta el crecimiento de tus aportes.</small></span>
        <span className="ax-calculator-action">Abrir calculadora <ArrowRight size={17} /></span>
      </a>
      <div className="ax-tools-grid"><LedgerDemo /><PropertyDemo /></div>
    </section>
    <ExperienceStory />
    <AiMap />
    <section className="ax-shell ax-end" aria-labelledby="ax-end-title">
      <div><h2 id="ax-end-title">¿Qué quieres aprender ahora?</h2><p>Elige una guía para seguir por tu cuenta o cuéntanos qué necesitas.</p></div>
      <div className="ax-end-actions"><a className="ax-primary" href="/contacto/">Hablar con Arkez <ArrowRight size={17} /></a><a href="/recursos/">Explorar recursos</a></div>
    </section>
  </div>;
}
