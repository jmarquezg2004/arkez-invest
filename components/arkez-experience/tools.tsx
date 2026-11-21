"use client";

import { useState } from "react";
import { BusinessMark, ScenarioMark } from "@/components/arkez-icons";
import { projectProperty } from "@/lib/property-example";
import { money, number } from "./format";

const controlDefinitions = [
  { key: "price", label: "Precio de compra", minimum: 120, maximum: 650, step: 5, unit: "M COP" },
  { key: "expenses", label: "Gastos mensuales", minimum: 0, maximum: 3, step: .1, unit: "M COP" },
  { key: "annualChange", label: "Cambio anual del valor", minimum: -8, maximum: 12, step: 1, unit: "%" },
] as const;

const baseProperty = { price: 300, expenses: .6, annualChange: 4 };
const scenarios = [
  { label: "Baja", annualChange: -4 },
  { label: "Base", annualChange: 4 },
  { label: "Alza", annualChange: 8 },
] as const;

export function PropertyDemo() {
  const [inputs, setInputs] = useState(baseProperty);
  const { future, operating, difference, years } = projectProperty(inputs);
  const scale = Math.max(inputs.price, future, operating);
  return <article id="inmuebles" className="ax-tool ax-property" aria-labelledby="ax-property-title">
    <div className="ax-tool-header"><span><BusinessMark size={19} /> Evaluador inmobiliario</span><small>Datos ficticios</small></div>
    <div className="ax-tool-body">
      <h3 id="ax-property-title">Antes de comprar, compara.</h3>
      <p>Prueba cuánto cambia el resultado si ajustas el precio, los gastos o el valor futuro que supones.</p>
      <div className="ax-scenario-picker" role="group" aria-label="Escenarios de valor futuro">
        {scenarios.map(({ label, annualChange }) => <button key={label} type="button"
          aria-pressed={inputs.annualChange === annualChange}
          onClick={() => setInputs({ ...inputs, annualChange })}>{label}</button>)}
        <button type="button" className="ax-reset" onClick={() => setInputs(baseProperty)}>Restablecer</button>
      </div>
      <div className="ax-property-layout">
        <div className="ax-property-controls">{controlDefinitions.map(({ key, label, minimum, maximum, step, unit }) => (
          <label key={key}><span>{label}</span><span className="ax-input-value" aria-hidden="true">{number.format(inputs[key])} {unit}</span>
            <input type="range" aria-label={label} aria-valuetext={`${number.format(inputs[key])} ${unit === "M COP" ? "millones de pesos colombianos" : "por ciento"}`} min={minimum} max={maximum} step={step} value={inputs[key]}
              onChange={(event) => setInputs({ ...inputs, [key]: Number(event.currentTarget.value) })} /></label>
        ))}</div>
        <div className="ax-property-results">
          <span id="ax-property-estimate">Valor estimado en {years} años</span><strong aria-describedby="ax-property-estimate" aria-live="polite">{money.format(future * 1e6)}</strong>
          <div className="ax-property-bars" aria-hidden="true">
            <span>Precio<progress max={scale} value={inputs.price} /></span>
            <span>Valor futuro<progress max={scale} value={future} /></span>
            <span>Gastos<progress max={scale} value={operating} /></span>
          </div>
          <dl><div><dt>Gastos acumulados</dt><dd>{money.format(operating * 1e6)}</dd></div>
            <div><dt>Cambio tras gastos</dt><dd>{money.format(difference * 1e6)}</dd></div></dl>
        </div>
      </div>
      <p className="ax-note">El cambio es valor futuro menos precio de compra y gastos. El ejercicio no incluye alquiler, deuda, impuestos ni costos de venta.</p>
    </div>
  </article>;
}

const sample = [
  { platform: "Plataforma A", name: "Fondo diversificado", capital: 4_800_000 },
  { platform: "Plataforma B", name: "Bonos", capital: 3_200_000 },
  { platform: "Plataforma C", name: "Fondo de acciones", capital: 1_700_000 },
];
const example = { platform: "Plataforma B", name: "Aporte de ejemplo", capital: 350_000 };

export function LedgerDemo() {
  const [filter, setFilter] = useState("Todas");
  const [added, setAdded] = useState(false);
  const positions = added ? [...sample, example] : sample;
  const rows = positions.filter(({ platform }) => filter === "Todas" || filter === platform);
  const amount = rows.reduce((total, { capital }) => total + capital, 0);
  return <article id="registro" className="ax-tool ax-ledger" aria-labelledby="ax-ledger-title">
    <div className="ax-tool-header"><span><ScenarioMark size={19} /> Registro de inversiones</span><small>Datos ficticios</small></div>
    <div className="ax-tool-body">
      <h3 id="ax-ledger-title">Mira tus posiciones juntas.</h3>
      <p>Consulta qué registraste y cuánto capital anotaste en cada plataforma.</p>
      <div className="ax-ledger-top">
        <label>Plataforma<select value={filter} onChange={(event) => setFilter(event.currentTarget.value)}>
          {["Todas", ...sample.map(({ platform }) => platform)].map((platform) => <option key={platform}>{platform}</option>)}
        </select></label>
        <p role="status"><span>Capital registrado</span><strong>{money.format(amount)}</strong></p>
      </div>
      <ul className="ax-ledger-list" role="list">{rows.map(({ platform, name, capital }) => (
        <li key={name}><span><strong>{name}</strong><small>{platform}</small></span><strong>{money.format(capital)}</strong></li>
      ))}</ul>
      <button type="button" className="ax-example-button" onClick={() => { if (!added) setFilter("Todas"); setAdded(!added); }}>
        {added ? "Quitar el movimiento de ejemplo" : "Añadir un movimiento de ejemplo"}
      </button>
      <p className="ax-note">Vista de muestra en esta página. Los movimientos no se guardan ni se sincronizan.</p>
    </div>
  </article>;
}
