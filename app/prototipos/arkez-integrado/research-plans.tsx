"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { base } from "./routes";

const plans = [
  { id: "guia", name: "Guía de comparación", price: "USD 5", points: ["Consulta adicional de Research", "Guía de criterios y glosario", "Ejemplos para revisar costos y fuentes"] },
  { id: "taller", name: "Taller autoguiado", price: "USD 10", points: ["Consulta adicional de Research", "Plantilla para comparar escenarios", "Caso resuelto con datos ficticios"] },
] as const;

const testLinks = {
  guia: process.env.NEXT_PUBLIC_ARKEZ_STRIPE_GUIDE_TEST,
  taller: process.env.NEXT_PUBLIC_ARKEZ_STRIPE_WORKSHOP_TEST,
};

export function ResearchPlans() {
  const [selection, setSelection] = useState<(typeof plans)[number]>();
  const [confirmed, setConfirmed] = useState(false);
  const testLink = selection && testLinks[selection.id];
  const stripeTest = testLink && /^https:\/\/buy\.stripe\.com\/test_[a-zA-Z0-9]+$/.test(testLink) ? testLink : undefined;
  return <section className="ai-research-pricing" id="planes-research" aria-labelledby="planes-research-title">
    <header><p className="ve-kicker">Arkez Research</p><h2 id="planes-research-title">Elige cómo seguir aprendiendo</h2><p>Prueba la elección de un plan o conversa con Arkez sobre una consultoría.</p></header>
    <div className="ai-research-plans">
      {plans.map((plan) => <article key={plan.id} data-featured={plan.id === "taller"}>
        <h3>{plan.name}</h3><p className="ai-plan-price">{plan.price}</p>
        <ul>{plan.points.map((point) => <li key={point}><Check size={16} aria-hidden="true" />{point}</li>)}</ul>
        <button className="ve-cta" type="button" aria-pressed={selection?.id === plan.id} aria-controls="arkez-plan-confirmation"
          onClick={() => { setSelection(plan); setConfirmed(false); }}>Elegir {plan.name.toLowerCase()} <ArrowRight size={17} aria-hidden="true" /></button>
      </article>)}
      <article><h3>Consultoría</h3><p className="ai-plan-price">A cotizar</p>
        <ul><li><Check size={16} aria-hidden="true" />Conversación inicial</li><li><Check size={16} aria-hidden="true" />Revisión de objetivos</li><li><Check size={16} aria-hidden="true" />Alcance y precio según el caso</li></ul>
        <a className="ve-cta" href={base + "/contacto/"}>Solicitar una reunión <ArrowRight size={17} aria-hidden="true" /></a>
      </article>
    </div>
    <div id="arkez-plan-confirmation" className="ai-plan-confirmation" hidden={!selection}>
      {selection && <><h3>{selection.name} · {selection.price}</h3>
        {stripeTest ? <a className="ve-cta" href={stripeTest} target="_blank" rel="noopener noreferrer">Abrir Stripe en modo de prueba</a>
          : <button className="ve-cta" type="button" onClick={() => setConfirmed(true)}>Simular pago</button>}
        <p role="status">{confirmed ? "Selección de prueba confirmada. No se realizó ningún cargo." : "Vista previa. Solo operaciones de prueba."}</p>
      </>}
    </div>
  </section>;
}
