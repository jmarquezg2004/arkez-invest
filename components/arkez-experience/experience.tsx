import { ArrowRight, EducationMark } from "@/components/arkez-icons";
import { AiMap } from "./ai-map";
import { ExperienceHero } from "./hero";
import { ExperienceSectionNav } from "./section-nav";
import { ExperienceStory } from "./story";
import { LedgerDemo, PropertyDemo } from "./tools";

export function ArkezExperience() {
  return <div className="ax-experience">
    <ExperienceHero />
    <ExperienceSectionNav />
    <section className="ax-tools ax-shell" id="herramientas-arkez" aria-labelledby="ax-tools-title">
      <div className="ax-section-title"><div><p className="ax-kicker">Empieza y aplica</p><h2 id="ax-tools-title">Prueba antes de decidir.</h2></div>
        <p>Prueba los controles con ejemplos y revisa cómo cambian los resultados.</p>
      </div>
      <PropertyDemo />
      <div className="ax-tools-grid">
        <a className="ax-calculator-link" href="/herramientas/interes-compuesto/">
          <EducationMark size={25} /><span><strong>El tiempo y tus aportes.</strong><small>Explora cómo crece un ahorro y cuánto cambia al modificar el plazo.</small></span>
          <span className="ax-calculator-action">Abrir calculadora <ArrowRight size={17} /></span>
        </a>
        <LedgerDemo />
      </div>
    </section>
    <ExperienceStory />
    <AiMap />
    <section className="ax-shell ax-end" aria-labelledby="ax-end-title">
      <div><h2 id="ax-end-title">¿Qué quieres aprender ahora?</h2><p>Elige una guía para seguir por tu cuenta o cuéntanos qué necesitas.</p></div>
      <div className="ax-end-actions"><a className="ax-primary" href="/contacto/">Hablar con Arkez <ArrowRight size={17} /></a><a href="/recursos/">Explorar recursos</a></div>
    </section>
  </div>;
}
