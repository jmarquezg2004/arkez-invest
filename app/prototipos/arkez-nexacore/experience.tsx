import { ArrowDown, ArrowRight } from "lucide-react";
import { FloatingNav, PathExplorer } from "./interactions";
import { ServiceDeck } from "./product-scenes";
import { Comparison, LearningStages } from "./narratives";
import { FinancialLab } from "./lab";
import poster from "./arquitectura.webp";
import mobilePoster from "./arquitectura-movil.webp";

export function NexaExperience({ standalone = true, learningHref, children }: { standalone?: boolean; learningHref?: string; children?: React.ReactNode }) {
  return <div className="nx">
    {standalone && <FloatingNav />}
    <section className="nx-hero" aria-labelledby="nx-title">
      <picture>
        <source media="(max-width: 650px)" srcSet={mobilePoster.src} />
        <img className="nx-hero-image" src={poster.src} width={poster.width} height={poster.height} alt="" fetchPriority="high" />
      </picture>
      <div className="nx-hero-inner">
        <p className="nx-kicker">Educación financiera aplicada</p>
        <h1 id="nx-title">
          Entiende tu dinero.
          <span className="nx-hero-middle">Aprende de los errores, el mercado no va en línea recta</span>
          <em>Aprovecha la tecnología.</em>
        </h1>
        <p>Formación, guía y simuladores para tomar decisiones con más criterio y con menos afán.</p>
        <div className="nx-hero-actions"><a className="nx-button nx-button-light" href="#nx-herramientas">Probar herramientas <ArrowRight size={18} /></a>{learningHref ? <a href={learningHref}>Encuentra tu ruta de aprendizaje <ArrowRight size={17} /></a> : <a href="#nx-caminos">Elegir mi nivel <ArrowDown size={17} /></a>}</div>
      </div>
      <a className="nx-hero-index" href="#nx-servicios">Explorar servicios <ArrowDown size={16} /></a>
    </section>
    <ServiceDeck />
    <Comparison />
    <LearningStages />
    <PathExplorer />
    <FinancialLab />
    {children}
    <section className="nx-end nx-wrap" aria-labelledby="nx-end-title">
      <div><h2 id="nx-end-title">¿Qué decisión quieres entender mejor?</h2><p>Conversemos sobre formación o consultoría para ti o tu equipo.</p></div>
      <a className="nx-button" href="/contacto/">Hablar con Arkez <ArrowRight size={18} /></a>
    </section>
    {standalone && <footer className="nx-footer"><div className="nx-wrap"><a href="/">Arkez Invest</a><a href="/legal/privacidad/">Privacidad</a></div></footer>}
  </div>;
}
