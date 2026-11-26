import { ArrowRight, Check } from "lucide-react";
import { base, researchCheckoutPath } from "./routes";

import { researchPlans } from "./research-plan-data";

export function ResearchPlans() {
  return <section className="ai-research-pricing" id="planes-research" aria-labelledby="planes-research-title">
    <header><p className="ve-kicker">Arkez Research</p><h2 id="planes-research-title">Elige cómo seguir aprendiendo</h2><p>Compara las opciones de pago único o conversa con Arkez sobre formación para tu caso.</p></header>
    <div className="ai-research-plans">
      {researchPlans.map((plan) => <article key={plan.id} data-featured={plan.id === "taller"}>
        <h3>{plan.name}</h3><p className="ai-plan-price">{plan.price}</p><p>Pago único · vista previa</p>
        <ul>{plan.points.map((point) => <li key={point}><Check size={16} aria-hidden="true" />{point}</li>)}</ul>
        <a className="ve-cta" href={`${researchCheckoutPath}?plan=${plan.id}`}>Elegir {plan.name.toLowerCase()} <ArrowRight size={17} aria-hidden="true" /></a>
      </article>)}
      <article><h3>Consultoría educativa</h3><p className="ai-plan-price">A cotizar</p>
        <ul><li><Check size={16} aria-hidden="true" />Conversación inicial</li><li><Check size={16} aria-hidden="true" />Orientación académica y diagnóstico de necesidades</li><li><Check size={16} aria-hidden="true" />Alcance y precio según el caso</li></ul>
        <a className="ve-cta" href={base + "/contacto/"}>Solicitar una reunión <ArrowRight size={17} aria-hidden="true" /></a>
      </article>
    </div>
  </section>;
}
