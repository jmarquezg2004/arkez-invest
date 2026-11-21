"use client";

import { useEffect, useRef, useState } from "react";
import { AllocationBand, MarketTrace } from "@/components/charts/financial-graphics";
import { journeyStages } from "@/lib/innovation-journey";

function StageGraphic({ index }: { index: number }) {
  if (index < 2) return <MarketTrace readings={index === 0 ? [100, 104, 101, 110, 108, 115] : [100, 104, 107, 106, 112, 115]} markers={index === 1} />;
  if (index === 4) return <AllocationBand label="Cartera ilustrativa" assets={[
    { name: "Acciones", weight: 50, tone: "blue" }, { name: "Bonos", weight: 35, tone: "steel" },
    { name: "Activos digitales", weight: 15, tone: "gold" },
  ]} />;
  if (index === 5) return <svg className="journey-svg" viewBox="0 0 410 145" role="img" aria-label="En este escenario, la cartera de referencia cae 3,5 % y la híbrida 7,4 %.">
    <path className="chart-grid" d="M180 10V135 M275 10V135 M370 10V135" />
    <text x="14" y="46">Referencia</text><text x="14" y="107">Híbrida</text>
    <rect x="304" y="28" width="66" height="27" rx="4" />
    <rect className="journey-bar-gold" x="229" y="89" width="141" height="27" rx="4" />
    <path className="journey-zero" d="M370 10V135" />
  </svg>;
  if (index === 2) return <svg className="journey-svg journey-chain" viewBox="0 0 410 144" role="img" aria-label="Tres asientos enlazados registran sucesivamente emisión, transferencia y verificación.">
    <path className="journey-flow" pathLength="1" d="M63 80H346" />
    <g><rect x="21" y="48" width="95" height="52" rx="4" /><text x="41" y="78">Emisión</text></g>
    <g><rect x="148" y="48" width="114" height="52" rx="4" /><text x="159" y="78">Transferencia</text></g>
    <g><rect x="293" y="48" width="96" height="52" rx="4" /><text x="309" y="78">Verificación</text></g>
  </svg>;
  return <svg className="journey-svg journey-chain" viewBox="0 0 410 144" role="img" aria-label="Un subyacente puede representarse por un título tradicional o mediante un token. Ambos tienen vías de custodia y salida que deben verificarse.">
    <path className="journey-flow" pathLength="1" d="M125 72H175Q197 72 197 47V33H224 M174 72Q197 72 197 99V111H224" />
    <g><rect x="12" y="48" width="113" height="48" rx="4" /><text x="30" y="76">Subyacente</text></g>
    <g><rect x="224" y="12" width="160" height="42" rx="4" /><text x="243" y="38">Título tradicional</text></g>
    <g><rect x="224" y="90" width="160" height="42" rx="4" /><text x="243" y="116">Activo tokenizado</text></g>
  </svg>;
}

export function InvestmentJourney() {
  const journey = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = journey.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(Number(entry.target.getAttribute("data-stage")));
      }
    }, { rootMargin: "-30% 0px -49% 0px" });
    root.querySelectorAll("[data-stage]").forEach((stage) => observer.observe(stage));
    return () => observer.disconnect();
  }, []);

  const stage = journeyStages[active];
  return (
    <section className="journey" id="trayectoria" ref={journey} aria-labelledby="journey-title">
      <div className="container-shell">
        <div className="journey-intro">
          <p className="eyebrow">De la señal al escenario</p>
          <h2 id="journey-title">Cómo se construye un criterio de inversión</h2>
          <p>Recorre seis etapas de un caso ficticio. Cada una aporta preguntas distintas para evaluar un portafolio.</p>
        </div>
        <div className="journey-layout">
          <figure className="journey-stage">
            <figcaption>{stage.subtitle}<span>{active + 1} / {journeyStages.length}</span></figcaption>
            <div className="journey-frame" key={stage.title}>
              <strong>{stage.measure}</strong>
              <StageGraphic index={active} />
            </div>
          </figure>
          <ol className="journey-steps" role="list">
            {journeyStages.map(({ title, body }, index) => <li data-stage={index} data-current={active === index} key={title}>
              <span aria-hidden="true">0{index + 1}</span>
              <div><h3>{title}</h3><p>{body}</p>{index === 5 && <a href="#simulador">Probar el simulador de carteras</a>}</div>
            </li>)}
          </ol>
        </div>
      </div>
    </section>
  );
}
