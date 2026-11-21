"use client";

import { useState } from "react";
import { calculateCompound, compoundExample, validateScenario } from "@/lib/compound-interest";
import { FrameLabel, PlotGrid, compact, money, sparkPath } from "./visuals";

const fields = [
  { key: "principal", label: "Capital inicial en COP", min: 0, max: 1e12, step: "any" },
  { key: "monthly", label: "Aporte mensual en COP", min: 0, max: 1e12, step: "any" },
  { key: "years", label: "Años", min: 1, max: 50, step: 1 },
  { key: "annualRate", label: "Tasa nominal anual (%)", min: -99, max: 100, step: "any" },
] as const;

export function PremiumGrowth() {
  const [draft, setDraft] = useState({
    principal: String(compoundExample.principal), monthly: String(compoundExample.monthly),
    years: String(compoundExample.years), annualRate: String(compoundExample.annualRate),
  });
  const [comparing, setComparing] = useState(false);
  const [focusYear, setYear] = useState<number | null>(null);
  const scenario = { ...compoundExample, ...Object.fromEntries(fields.map(({ key }) => [key, draft[key] === "" ? NaN : Number(draft[key])])) };
  const issue = validateScenario(scenario);
  const main = issue ? null : calculateCompound(scenario);
  const baseline = comparing && main ? calculateCompound({ ...scenario, annualRate: 0 }) : null;
  const years = main?.final.year ?? 1;
  const year = Math.min(focusYear ?? years, years);
  const row = main?.rows[year];
  const values = main?.rows.map(({ balance }) => balance) ?? [];
  const paid = main?.rows.map(({ contributed }) => contributed) ?? [];
  const scale = Math.max(1, ...values, ...paid);
  const trace = sparkPath(values, 0, scale);
  const contribution = sparkPath(paid, 0, scale);
  // The lower edge follows contributions in reverse x order, preserving the signed difference.
  const difference = `${trace} ${paid.map((_, index) => {
    const reverse = paid.length - 1 - index;
    return `L${56 + reverse * 375 / years} ${144 - paid[reverse] * 128 / scale}`;
  }).join(" ")} Z`;

  return <div className="px-growth">
    <FrameLabel title="Proyección de ahorro" badge="Ejercicio en COP" />
    <div className="px-growth-grid">
      <fieldset className="px-growth-fields">
        <legend>Personaliza la proyección</legend>
        {fields.map(({ key, label, ...limits }) => (
          <label key={key}>{label}<input type="number" inputMode={key === "years" ? "numeric" : "decimal"} {...limits}
            value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} /></label>
        ))}
        <button type="button" className="px-toggle" aria-pressed={comparing} onClick={() => setComparing(!comparing)}>
          {comparing ? "Ocultar comparación al 0 %" : "Comparar con una tasa del 0 %"}
        </button>
        <p>Aportes al cierre de mes y capitalización mensual. El ejemplo excluye costos e impuestos.</p>
      </fieldset>
      <div className="px-growth-result">
        {issue && <p role="status">{issue}</p>}
        {main && row && <>
          <span>Capital final estimado · {years} años</span>
          <strong className="px-growth-total" role="status">{money.format(main.final.balance)}</strong>
          <PlotGrid labels={[compact.format(scale),compact.format(scale/2),"0"]} label="Proyección anual en COP. Usa el control Año para consultar cifras exactas." onInspect={(progress) => setYear(Math.round(progress * years))}>
            <path className="px-gain" d={difference} />
            <path className="px-paid" d={contribution} />
            <path key={trace} className="px-trace" pathLength="1" d={trace} />
            <path className="px-cross" d={`M${56+375*year/years} 16V144`} />
            <circle className="px-node" cx={56+375*year/years} cy={144-128*row.balance/scale} r="5" />
          </PlotGrid>
          <div className="px-chart-key"><span>Capital estimado</span><span>Aportes{comparing ? " · tasa del 0 %" : ""}</span></div>
          <label className="px-chart-year">Año de la proyección <input type="range" min="0" max={years} value={year}
            onChange={(event) => setYear(Number(event.target.value))} /></label>
          <dl className="px-growth-values" aria-label={`Detalle del año ${year}`}>
            <div><dt>Año</dt><dd>{year}</dd></div>
            <div><dt>Capital</dt><dd>{money.format(row.balance)}</dd></div>
            <div><dt>Aportes</dt><dd>{money.format(row.contributed)}</dd></div>
            <div><dt>Crecimiento</dt><dd>{money.format(row.growth)}</dd></div>
          </dl>
          {baseline && <p className="px-compare" role="status">Al 0 %, el capital final sería {money.format(baseline.final.balance)}. Diferencia: {money.format(main.final.growth)}.</p>}
        </>}
      </div>
    </div>
  </div>;
}
