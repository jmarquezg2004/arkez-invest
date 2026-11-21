"use client";

import { useId, useState } from "react";
import { comparePortfolios } from "@/lib/innovation-scenario";
import { FrameLabel, PlotGrid, decimal, sparkPath } from "./visuals";
import { PremiumNumberTicker } from "./number-ticker";

const scenarios = [
  { label: "Caída", shock: -25, market: [100, 98, 102, 97, 95, 96, 91, 92] },
  { label: "Base", shock: 0, market: [100, 96, 102, 100, 103, 101, 105, 104] },
  { label: "Alza", shock: 25, market: [100, 103, 102, 108, 106, 112, 111, 117] },
] as const;

const assets = [
  { key: "equity", label: "Acciones", tone: "blue" },
  { key: "bonds", label: "Bonos", tone: "cream" },
  { key: "digital", label: "Activos digitales", tone: "gold" },
] as const;
type Asset = typeof assets[number]["key"];

function DeskAllocation({ value, selection }: { value: ReturnType<typeof comparePortfolios>; selection: Asset | null }) {
  return <dl className="px-allocations">
    {([{ label: "Referencia", weights: value.reference }, { label: "Combinada", weights: value.diversified }]).map(({ label, weights }) => {
      let position = 0;
      return <div key={label}>
        <dt>{label}</dt>
        <dd>
          <svg viewBox="0 0 100 7" preserveAspectRatio="none"
            aria-label={assets.map(({ label, key }) => `${label}: ${weights[key]} %`).join(", ")} role="img">
            {assets.map(({ key, tone }) => {
              const x = position;
              position += weights[key];
              return <rect key={key} x={x} width={weights[key]} height="7" data-tone={tone} data-faint={Boolean(selection && selection !== key)} />;
            })}
          </svg>
          {selection && <span>{weights[selection]} %</span>}
        </dd>
      </div>;
    })}
  </dl>;
}

export function PremiumDashboard() {
  const id = useId();
  const [scenario, selectScenario] = useState(1);
  const [weight, setWeight] = useState(15);
  const [active, setActive] = useState<Asset | null>(null);
  const [point, setPoint] = useState(7);
  const selected = scenarios[scenario];
  const result = comparePortfolios(weight, selected.shock);
  const path = sparkPath(selected.market, 90, 120);

  return <div className="px-desk" aria-label="Simulador educativo de carteras">
    <FrameLabel title="Estudio de escenarios" />
    <div className="px-desk-inner">
      <div className="px-desk-top">
        <fieldset className="px-segments">
          <legend>Comportamiento de activos digitales</legend>
          {scenarios.map(({ label }, index) => (
            <label key={label}><input type="radio" name={`${id}-market`} checked={scenario === index}
              onChange={() => selectScenario(index)} /><span>{label}</span></label>
          ))}
        </fieldset>
        <dl className="px-metrics">
          <div><dt>Cartera de referencia</dt><dd>{decimal.format(result.referenceChange)} %</dd></div>
          <div><dt>Cartera combinada</dt><dd><PremiumNumberTicker value={result.diversifiedChange} /></dd></div>
        </dl>
      </div>
      <figure className="px-market" aria-labelledby={`${id}-caption`}>
        <figcaption id={`${id}-caption`}><span>Trayectoria de ejemplo</span><span>Índice base 100</span></figcaption>
        <PlotGrid labels={["120","105","90"]} label="Índice ficticio asociado a la escena. La cartera se calcula por separado." onInspect={(progress) => setPoint(Math.round(progress * 7))}>
          <path className="px-fill" d={`${path} V144 H56Z`} />
          <path key={path} className="px-trace" pathLength="1" d={path} />
          <circle className="px-node" cx={56 + point * 375 / 7} cy={144 - (selected.market[point] - 90) * 128 / 30} r="5" />
        </PlotGrid>
        <div className="px-scrub">
          <label>Observación <input type="range" min="1" max="8" value={point+1} onChange={(event) => setPoint(Number(event.target.value)-1)} /></label>
          <output>{selected.market[point]} puntos</output>
        </div>
      </figure>
      <div className="px-desk-bottom">
        <label className="px-weight">Peso digital <strong>{weight} %</strong>
          <input type="range" min="0" max="30" value={weight} onChange={(event) => setWeight(Number(event.target.value))} />
        </label>
        <DeskAllocation value={result} selection={active} />
        <ul className="px-asset-keys" role="list">
          {assets.map(({ key, label, tone }) => <li key={key}><button type="button" aria-pressed={active === key}
            data-tone={tone} onClick={() => setActive(active === key ? null : key)}>{label}</button></li>)}
        </ul>
      </div>
    </div>
  </div>;
}
