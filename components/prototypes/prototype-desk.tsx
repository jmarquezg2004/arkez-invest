"use client";

import { useId, useState } from "react";
import { AllocationMark, MarketMark, RiskMark, TechnologyMark } from "@/components/arkez-icons";
import { esNumber, MarketTrace } from "@/components/charts/financial-graphics";
import { evaluateScenario, scenarioKeys, type ScenarioKey } from "@/lib/learning-scenarios";

const scenarios = {
  mercados: { title: "Mercados", label: "Variación del índice", min: -25, max: 25, initial: 12, step: 1, unit: "puntos", mark: MarketMark, note: "El índice ficticio parte de 100. Cambia su variación para ver el nivel de cierre." },
  diversificacion: { title: "Asignación", label: "Peso en renta variable", min: 0, max: 100, initial: 60, step: 5, unit: "%", mark: AllocationMark, note: "La renta variable cae un 20 %. El resto de la cartera permanece estable." },
  riesgo: { title: "Riesgo", label: "Magnitud de la pérdida", min: 0, max: 60, initial: 15, step: 1, unit: "COP", mark: RiskMark, note: "Mide la pérdida sobre una posición ficticia de 1.000.000 COP." },
  herramientas: { title: "Flujo de caja", label: "Pagos del periodo", min: 0, max: 1_500_000, initial: 700_000, step: 50_000, unit: "COP", mark: TechnologyMark, note: "Se parte de 400.000 COP con ingresos de 800.000 COP. Cambia los pagos y observa el saldo." },
} as const;

function DeskGraphic({ scenario, value, result }: { scenario: ScenarioKey; value: number; result: number }) {
  if (scenario === "mercados") {
    return <MarketTrace readings={[100, 104, 102, 112, 108, result]} markers />;
  }
  if (scenario === "diversificacion") {
    return <figure className="desk-allocation">
      <figcaption>Distribución de la cartera</figcaption>
      <svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
        <rect width="100" height="12" className="desk-remainder" />
        <rect width={value} height="12" className="desk-exposure" />
      </svg>
      <p><span>Renta variable <strong>{value} %</strong></span><span>Estable <strong>{100 - value} %</strong></span></p>
    </figure>;
  }

  const max = scenario === "riesgo" ? 1_000_000 : 1_200_000;
  const current = scenario === "riesgo" ? max + result : result;
  const slot = (amount: number) => 50 + amount / max * 46;
  return <figure className="desk-allocation">
    <figcaption>{scenario === "riesgo" ? "Valor de la posición" : "Saldo al cierre"} · COP</figcaption>
    <svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
      <rect width="100" height="12" className="desk-remainder" />
      <rect x={Math.min(50, slot(current))} width={Math.abs(slot(current) - 50)} height="12" className="desk-exposure" data-negative={current < 0} />
      <path d="M50 0V12" className="desk-zero" />
    </svg>
    <p><span>−{esNumber.format(max)}</span><span>0</span><span>+{esNumber.format(max)}</span></p>
    <strong>{esNumber.format(current)} COP</strong>
  </figure>;
}

export function PrototypeDesk() {
  const [scenario, setScenario] = useState<ScenarioKey>("mercados");
  const [inputs, setInputs] = useState<Record<ScenarioKey, number>>({
    mercados: scenarios.mercados.initial,
    diversificacion: scenarios.diversificacion.initial,
    riesgo: scenarios.riesgo.initial,
    herramientas: scenarios.herramientas.initial,
  });
  const rangeId = useId();
  const { label, min, max, step, unit, note } = scenarios[scenario];
  const current = inputs[scenario];
  const result = evaluateScenario(scenario, current);
  return <div className="proto-desk">
    <div className="desk-heading"><strong>Laboratorio financiero</strong><span>Datos ficticios</span></div>
    <div className="desk-tabs" role="group" aria-label="Escenario de simulación">
      {scenarioKeys.map((key) => {
        const { title, mark: Mark } = scenarios[key];
        return <button key={key} type="button" aria-pressed={key === scenario} onClick={() => setScenario(key)}><Mark size={17} />{title}</button>;
      })}
    </div>
    <div className="desk-result" role="status"><strong>{esNumber.format(result)}</strong> <span>{unit}</span></div>
    <DeskGraphic scenario={scenario} value={current} result={result} />
    <label className="desk-slider-label" htmlFor={rangeId}>{label}<span>{esNumber.format(current)} {scenario === "herramientas" ? "COP" : "%"}</span></label>
    <input id={rangeId} type="range" min={min} max={max} step={step} value={current}
      aria-valuetext={`${esNumber.format(current)} ${scenario === "herramientas" ? "pesos colombianos" : "por ciento"}`}
      onChange={(event) => {
        const value = event.currentTarget.valueAsNumber;
        setInputs((previous) => ({ ...previous, [scenario]: value }));
      }} />
    <p className="desk-note">{note}</p>
  </div>;
}
