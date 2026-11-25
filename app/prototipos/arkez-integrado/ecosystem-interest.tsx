"use client";

import { useState } from "react";

export function EcosystemInterest() {
  const [plan, setPlan] = useState("");
  const [confirmedPlan, setConfirmedPlan] = useState("");
  return <details className="ai-eco-demo">
    <summary>Probar solicitud de información</summary>
    <form onSubmit={(event) => { event.preventDefault(); if (plan) setConfirmedPlan(plan); }}>
      <p>Demostración con datos de ejemplo. Tu selección se queda en esta página.</p>
      <label htmlFor="ecosystem-plan">Plan de interés</label>
      <select id="ecosystem-plan" value={plan} required onChange={(event) => { setPlan(event.target.value); setConfirmedPlan(""); }}>
        <option value="">Elige un plan</option>
        <option>Guía de comparación · US$5</option>
        <option>Taller autoguiado · US$10</option>
      </select>
      <button type="submit" className="ve-cta">Simular solicitud</button>
      {confirmedPlan && <p role="status">Solicitud de prueba completada para {confirmedPlan}. Sin envío ni cobro.</p>}
    </form>
  </details>;
}
