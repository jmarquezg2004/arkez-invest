"use client";

import { useId, useState } from "react";
import { recordCommercialEvent } from "@/lib/commercial-events";
import { calculateCompound, compoundExample, validateScenario } from "@/lib/compound-interest";

const fields = [
  { key: "principal", label: "Capital inicial", min: 0, max: 1e12 },
  { key: "monthly", label: "Aporte mensual", min: 0, max: 1e12 },
  { key: "years", label: "Años", min: 1, max: 50 },
] as const;

const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", currencyDisplay: "code", maximumFractionDigits: 0 });

export function CompactCompound() {
  const [inputs, setInputs] = useState({
    principal: String(compoundExample.principal), monthly: String(compoundExample.monthly), years: String(compoundExample.years),
  });
  const [engaged, setEngaged] = useState(false);
  const id = useId();
  const scenario = {
    ...compoundExample,
    principal: inputs.principal === "" ? NaN : Number(inputs.principal),
    monthly: inputs.monthly === "" ? NaN : Number(inputs.monthly),
    years: inputs.years === "" ? NaN : Number(inputs.years),
  };
  const issue = validateScenario(scenario);
  const projection = issue ? null : calculateCompound(scenario);
  const maximum = Math.max(1, projection?.final.balance ?? 0);
  const plot = (key: "balance" | "contributed") => projection?.rows.map((row, index) => {
    const x = 12 + 376 * row.year / scenario.years;
    const y = 100 - 84 * row[key] / maximum;
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
  const estimate = plot("balance");
  const deposited = plot("contributed");

  return (
    <div className="quick-calc">
      <fieldset aria-describedby={`${id}-rate`}>
        <legend>Ajusta tu escenario en COP</legend>
        <div className="quick-fields">
          {fields.map(({ key, label, min, max }) => {
            const raw = inputs[key];
            const invalid = raw === "" || Number(raw) < min || Number(raw) > max || (key === "years" && !Number.isInteger(Number(raw)));
            return <label key={key}>{label}
              <input type="number" inputMode={key === "years" ? "numeric" : "decimal"} min={min} max={max} step={key === "years" ? 1 : "any"}
                value={raw} aria-invalid={invalid || undefined} onChange={(event) => {
                  const value = event.currentTarget.value;
                  setInputs({ ...inputs, [key]: value });
                  if (!engaged) {
                    setEngaged(true);
                    recordCommercialEvent({ type: "calculator_use", action: "calculate" });
                  }
                }} />
            </label>;
          })}
        </div>
        <p id={`${id}-rate`}>Ejemplo al {compoundExample.annualRate} % anual nominal con capitalización mensual. Sin costos ni impuestos.</p>
      </fieldset>
      <p role="status" className="quick-total">
        <span>Capital final estimado</span>
        <strong>{projection ? money.format(projection.final.balance) : "—"}</strong>
        {issue && <small>{issue}</small>}
      </p>
      {projection && <figure className="quick-figure">
        <svg viewBox="0 0 400 111" role="img" aria-label={`Proyección a ${scenario.years} años. Total aportado: ${money.format(projection.final.contributed)}.`}>
          <path className="quick-grid" d="M12 16H388 M12 44H388 M12 72H388 M12 100H388" />
          <path className="quick-area" d={`${estimate} L388 100 H12 Z`} />
          <path className="quick-paid" d={deposited} />
          <path key={estimate} className="quick-trace" pathLength="1" d={estimate} />
          <circle cx="388" cy={100 - 84 * projection.final.balance / maximum} r="4" />
        </svg>
        <figcaption><span>Total aportado</span><span>Capital estimado</span><span>Año {scenario.years}</span></figcaption>
      </figure>}
      <noscript><p>Activa JavaScript para ajustar este escenario.</p></noscript>
    </div>
  );
}
