"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, LockKeyhole } from "lucide-react";
import { base } from "./routes";
import { researchPlans } from "./research-plan-data";

const stripeLinks = {
  guia: process.env.NEXT_PUBLIC_ARKEZ_STRIPE_GUIDE_TEST,
  taller: process.env.NEXT_PUBLIC_ARKEZ_STRIPE_WORKSHOP_TEST,
};

export function ResearchCheckout() {
  const [selection, setSelection] = useState<(typeof researchPlans)[number]>(researchPlans[0]);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const restore = () => {
      const plan = new URLSearchParams(window.location.search).get("plan");
      setSelection(researchPlans.find(({ id }) => id === plan) ?? researchPlans[0]);
      setConfirmed(false);
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  const url = URL.parse(stripeLinks[selection.id]?.trim() ?? "");
  const checkout = url?.origin === "https://buy.stripe.com" && !url.username && !url.password &&
    /^\/test_[A-Za-z0-9]+\/?$/.test(url.pathname) && !url.search && !url.hash ? url.href : undefined;

  return <main className="ai-checkout">
    <div className="container-shell">
      <a className="ai-checkout-back" href={base + "/research/#planes-research"}><ArrowLeft size={18} aria-hidden="true" /> Volver a los planes</a>
      <header className="ai-checkout-header">
        <p className="eyebrow">Arkez Research</p>
        <h1>Revisa tu plan <em>de aprendizaje.</em></h1>
        <p>Elige un recurso y revisa el contenido, el precio y la modalidad antes de continuar.</p>
      </header>
      <div className="ai-checkout-layout">
        <fieldset className="ai-checkout-options">
          <legend>Elige tu plan</legend>
          {researchPlans.map((plan) => <label key={plan.id}>
            <input type="radio" name="research-plan" checked={selection.id === plan.id} onChange={() => {
              setSelection(plan);
              setConfirmed(false);
              const next = new URL(window.location.href);
              next.searchParams.set("plan", plan.id);
              window.history.replaceState(window.history.state, "", next);
            }} />
            <span><strong>{plan.name}</strong><small>{plan.description}</small></span>
            <b>{plan.price}</b>
          </label>)}
        </fieldset>
        <section className="ai-checkout-summary" aria-labelledby="checkout-summary-title">
          <h2 id="checkout-summary-title">Resumen del pedido</h2>
          <div aria-live="polite">
            <h3>{selection.name}</h3>
            <ul>{selection.points.map((point) => <li key={point}><Check size={16} aria-hidden="true" />{point}</li>)}</ul>
            <dl><div><dt>Total</dt><dd>{selection.price}</dd></div><div><dt>Modalidad</dt><dd>Pago único</dd></div></dl>
          </div>
          {checkout ? <a className="nx-button nx-button-learning" href={checkout} target="_blank" rel="noopener noreferrer"><LockKeyhole size={18} aria-hidden="true" /> Continuar a Stripe de prueba <ArrowUpRight size={17} aria-hidden="true" /></a>
            : <button className="nx-button nx-button-learning" type="button" onClick={() => setConfirmed(true)}>Simular el pago</button>}
          <p role="status">{confirmed ? "Simulación completada. No hubo ningún cargo." : checkout ? "Stripe se abre en otra pestaña. Este enlace solo admite pagos de prueba." : "Vista previa. El enlace de Stripe de prueba todavía no está configurado."}</p>
        </section>
      </div>
    </div>
  </main>;
}
