import { ArrowRight, EducationMark } from "@/components/arkez-icons";
import { AiMap } from "./ai-map";
import { ExperiencePaths } from "./hero";
import { ExperienceSectionNav } from "./section-nav";
import { ExperienceStory } from "./story";
import { LedgerDemo, PropertyDemo } from "./tools";
import { EditorialIntro } from "./editorial-intro";

export function ArkezExperience() {
  return <div className="ax-experience">
    <EditorialIntro />
    <ExperienceSectionNav />
    <section id="herramientas-arkez" aria-label="Herramientas financieras">
      <PropertyDemo />
      <div className="ax-shell ax-tools-grid">
        <a className="ax-calculator-link" href="/herramientas/interes-compuesto/">
          <EducationMark size={25} /><span><strong>El tiempo y tus aportes.</strong><small>Explora cómo crece un ahorro y cuánto cambia al modificar el plazo.</small></span>
          <span className="ax-calculator-action">Abrir calculadora <ArrowRight size={17} /></span>
        </a>
        <LedgerDemo />
      </div>
    </section>
    <ExperiencePaths />
    <ExperienceStory />
    <AiMap />
    <section className="ax-shell ax-end" aria-labelledby="ax-end-title">
      <div><h2 id="ax-end-title">¿Qué quieres aprender ahora?</h2><p>Elige una guía para seguir por tu cuenta o cuéntanos qué necesitas.</p></div>
      <div className="ax-end-actions"><a className="ax-primary" href="/contacto/">Hablar con Arkez <ArrowRight size={17} /></a><a href="/recursos/">Explorar recursos</a></div>
    </section>
  </div>;
}
