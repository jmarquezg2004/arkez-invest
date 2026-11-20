"use client";

import { useRef, useState } from "react";
import { ArrowRight, ChartNoAxesCombined, Layers3, Shield, SlidersHorizontal } from "lucide-react";
import { evaluateScenario, scenarioKeys, type ScenarioKey } from "@/lib/learning-scenarios";

const scenarios = {
  mercados: {
    tab: "Mercados", title: "Análisis de mercados", icon: ChartNoAxesCombined,
    description: "Parte de un índice ficticio de 100 puntos y compara el inicio con el cierre. En una serie real, revisa el periodo y la fuente antes de interpretar el movimiento.",
    control: "Variación del periodo", initial: 12, min: -25, max: 25, step: 1,
    result: "Cierre del índice", unit: "puntos", href: "/servicios/analisis-de-mercados/", link: "Explorar el análisis de mercados",
    first: "Nivel inicial", last: "Nivel final", chart: "Trayectoria ilustrativa del índice",
  },
  diversificacion: {
    tab: "Diversificación", title: "Diversificación de inversiones", icon: Layers3,
    description: "Distribuye una cartera ficticia entre renta variable y un activo sin cambios en este escenario. La renta variable cae un 20 %. Observa cómo el peso de cada parte cambia el resultado.",
    control: "Peso en renta variable", initial: 60, min: 0, max: 100, step: 5,
    result: "Variación de la cartera", unit: "%", href: "/recursos/guias/primeros-pasos/", link: "Leer la guía para empezar a invertir",
    first: "Renta variable", last: "Activo sin cambios", chart: "Pesos de la cartera ilustrativa",
  },
  riesgo: {
    tab: "Riesgo", title: "Gestión del riesgo", icon: Shield,
    description: "Aplica una caída a una posición ficticia de $1.000.000 COP. Comparar la pérdida en pesos con el capital inicial ayuda a poner el porcentaje en contexto.",
    control: "Caída del activo", initial: 15, min: 0, max: 60, step: 1,
    result: "Cambio de la posición", unit: "COP", href: "/legal/riesgos/", link: "Entender el riesgo financiero",
    first: "Capital inicial", last: "Capital restante", chart: "Valor de la posición antes y después de la caída",
  },
  herramientas: {
    tab: "Herramientas", title: "Tecnología aplicada", icon: SlidersHorizontal,
    description: "Practica un cálculo de caja con $400.000 COP iniciales e ingresos de $800.000 COP. Cambia los pagos y observa cuándo el saldo pasa a ser negativo.",
    control: "Pagos del periodo", initial: 700_000, min: 0, max: 1_500_000, step: 50_000,
    result: "Saldo al cierre", unit: "COP", href: "/recursos/guias/#comparar-escenarios", link: "Explorar el laboratorio en Excel",
    first: "Saldo inicial", last: "Saldo final", chart: "Saldo de caja inicial y final",
  },
} as const;

const number = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });

function format(value: number, unit: string) {
  return `${number.format(value)} ${unit}`;
}

function Graph({ scenario, input, result }: { scenario: ScenarioKey; input: number; result: number }) {
  const { first, last, chart } = scenarios[scenario];
  if (scenario === "mercados") {
    const endY = 93 - input * 2;
    const path = `M 18 93 L 80 71 L 147 86 L 211 45 L 284 69 L 362 ${endY}`;
    return (
      <figure className="lab-chart">
        <svg viewBox="0 0 380 147" role="img" aria-label={`${chart}: 100 puntos al inicio, ${format(result, "puntos")} al cierre.`}>
          <path className="lab-grid" d="M18 26H362 M18 59H362 M18 93H362 M18 126H362" />
          <path className="lab-area" d={`${path} L 362 138 H 18 Z`} />
          <path className="lab-line" d={path} />
          <circle className="lab-dot" cx="362" cy={endY} r="5" />
        </svg>
        <figcaption><span>{first}: 100</span><span>{last}: {number.format(result)}</span></figcaption>
      </figure>
    );
  }
  const [start, end, domain, unit] = scenario === "diversificacion"
    ? [input, 100 - input, 100, "%"]
    : scenario === "riesgo"
      ? [1_000_000, 1_000_000 + result, 1_000_000, "COP"]
      : [400_000, result, 1_200_000, "COP"];
  const base = 80;
  const width = (value: number) => Math.abs(value) / domain * 278;

  return (
    <figure className="lab-chart">
      <svg viewBox="0 0 380 147" role="img" aria-label={`${chart}: ${first}, ${format(start, unit)}. ${last}, ${format(end, unit)}.`}>
        <path className="lab-grid" d="M80 14V133 M150 14V133 M220 14V133 M290 14V133 M360 14V133" />
        <rect className="lab-bar" x={base} y="31" width={width(start)} height="29" rx="4" />
        <rect className={end < 0 ? "lab-bar negative" : "lab-bar comparison"} x={end < 0 ? base - width(end) : base} y="87" width={width(end)} height="29" rx="4" />
      </svg>
      <figcaption><span>{first}: {format(start, unit)}</span><span>{last}: {format(end, unit)}</span></figcaption>
    </figure>
  );
}

export function LearningLab() {
  const [active, setActive] = useState<ScenarioKey>("mercados");
  const [values, setValues] = useState<Record<ScenarioKey, number>>({
    mercados: scenarios.mercados.initial,
    diversificacion: scenarios.diversificacion.initial,
    riesgo: scenarios.riesgo.initial,
    herramientas: scenarios.herramientas.initial,
  });
  const tabs = useRef<HTMLDivElement>(null);
  return (
    <div className="learning-lab">
      <div className="lab-tabs" role="tablist" aria-label="Ejercicios financieros" ref={tabs}>
        {scenarioKeys.map((key, index) => {
          const { tab, icon: Icon } = scenarios[key];
          return <button key={key} type="button" role="tab" id={`tab-${key}`} aria-controls={`exercise-${key}`} aria-selected={active === key} tabIndex={active === key ? 0 : -1} onClick={() => setActive(key)} onKeyDown={(event) => {
            const destinations: Record<string, number> = {
              ArrowLeft: (index + scenarioKeys.length - 1) % scenarioKeys.length,
              ArrowRight: (index + 1) % scenarioKeys.length,
              Home: 0,
              End: scenarioKeys.length - 1,
            };
            const next = destinations[event.key];
            if (next === undefined) return;
            event.preventDefault();
            setActive(scenarioKeys[next]);
            tabs.current?.querySelectorAll("button")[next]?.focus();
          }}><Icon size={17} aria-hidden="true" />{tab}</button>;
        })}
      </div>
      {scenarioKeys.map((key) => {
        const scenario = scenarios[key];
        const value = values[key];
        const result = evaluateScenario(key, value);
        const controlValue = format(value, key === "herramientas" ? "COP" : "%");

        return (
          <div className="lab-panel" key={key} role="tabpanel" id={`exercise-${key}`} aria-labelledby={`tab-${key}`} hidden={active !== key}>
            <div className="lab-explanation">
              <h3>{scenario.title}</h3>
              <p>{scenario.description}</p>
              <label htmlFor={`value-${key}`}>{scenario.control}</label>
              <div className="lab-range">
                <input id={`value-${key}`} type="range" min={scenario.min} max={scenario.max} step={scenario.step} value={value} aria-valuetext={controlValue} onChange={(event) => {
                  const nextValue = event.currentTarget.valueAsNumber;
                  setValues((previous) => ({ ...previous, [key]: nextValue }));
                }} />
                <span aria-hidden="true">{controlValue}</span>
              </div>
              <a href={scenario.href}>{scenario.link}<ArrowRight size={16} aria-hidden="true" /></a>
            </div>
            <div className="lab-visual">
              <div className="lab-result" role="status" aria-atomic="true">
                <span>{scenario.result}</span>
                <strong>{format(result, scenario.unit)}</strong>
              </div>
              <Graph scenario={key} input={value} result={result} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
