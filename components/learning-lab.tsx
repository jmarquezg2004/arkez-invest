"use client";

import { useRef, useState } from "react";
import { ArrowRight, ChartNoAxesCombined, Layers3, Shield, SlidersHorizontal } from "lucide-react";
import { AllocationBand, MarketTrace } from "@/components/charts/financial-graphics";
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
    description: "Prueba una caída o un alza sobre una posición ficticia de $1.000.000 COP y compara el resultado con un escenario sin cambios.",
    control: "Caída del activo (un valor negativo representa un alza)", initial: 15, min: -60, max: 60, step: 1,
    result: "Cambio de la posición", unit: "COP", href: "/legal/riesgos/", link: "Entender el riesgo financiero",
    first: "Capital inicial", last: "Capital restante", chart: "Valor de la posición según el escenario",
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
    return <figure className="lab-chart lab-market">
      <figcaption><strong>{chart}</strong><span>Puntos · datos ficticios</span></figcaption>
      <MarketTrace readings={[100, 106, 102, 115, 108, result]} markers />
      <div className="lab-chart-caption"><span>{first}: 100</span><span>{last}: {number.format(result)}</span></div>
    </figure>;
  }
  if (scenario === "diversificacion") {
    return <figure className="lab-chart lab-allocation">
      <figcaption><strong>{chart}</strong><span>% del total</span></figcaption>
      <AllocationBand label="Distribución de activos" assets={[
        { name: first, weight: input, tone: "gold" },
        { name: last, weight: 100 - input, tone: "blue" },
      ]} />
      <p>Si la renta variable cae 20 %, el efecto ponderado es {format(result, "%")}.</p>
    </figure>;
  }
  if (scenario === "riesgo") {
    const values = [
      { label: "Caída", value: 1_000_000 - Math.abs(result), state: "loss" },
      { label: "Sin cambio", value: 1_000_000, state: "neutral" },
      { label: "Alza", value: 1_000_000 + Math.abs(result), state: "gain" },
    ];
    return <figure className="lab-chart lab-risk">
      <figcaption><strong>{chart}</strong><span>COP · variación de ±{format(Math.abs(input), "%")}</span></figcaption>
      <svg viewBox="0 0 320 118" aria-hidden="true">
        <path className="chart-grid" d="M0 26H320 M0 68H320 M0 109H320" />
        {values.map(({state, value}, index) => {
          const height = value / 16_000;
          return <rect key={state} className="risk-column" data-tone={state} data-selected={state === (input > 0 ? "loss" : input < 0 ? "gain" : "neutral")} x={index * 105 + 23} y={109 - height} width="65" height={height} rx="4" />;
        })}
      </svg>
      <div className="lab-risk-labels">{values.map(({label,value}) => <span key={label}>{label}<strong>{number.format(value)}</strong></span>)}</div>
    </figure>;
  }
  return <figure className="lab-chart lab-cash">
    <figcaption><strong>{chart}</strong><span>COP · datos ficticios</span></figcaption>
    <dl>
      <div><dt>Saldo inicial</dt><dd>{number.format(400_000)}</dd></div>
      <div><dt>Ingresos</dt><dd>+{number.format(800_000)}</dd></div>
      <div><dt>Pagos</dt><dd>−{number.format(input)}</dd></div>
      <div data-negative={result < 0}><dt>Saldo final</dt><dd>{number.format(result)}</dd></div>
    </dl>
    <p>{result < 0 ? "Los pagos superan los fondos disponibles." : "Los fondos del período cubren los pagos."}</p>
  </figure>;
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
            <div className="lab-visual" data-scenario={key}>
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
