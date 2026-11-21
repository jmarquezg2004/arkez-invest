"use client";

import { useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";
import { comparePortfolios } from "@/lib/innovation-scenario";

const formatter = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });
const percentage = (value: number) => `${formatter.format(value)} %`;
const presets = [
  { label: "Caída", shock: -25 },
  { label: "Sin cambios", shock: 0 },
  { label: "Alza", shock: 25 },
] as const;

const instruments = [
  { key: "equity", label: "Acciones" },
  { key: "bonds", label: "Bonos" },
  { key: "digital", label: "Activos digitales" },
] as const;

export function PortfolioLab() {
  const [ready, setReady] = useState(false);
  const [weight, setWeight] = useState(15);
  const [shock, setShock] = useState(-25);
  useEffect(() => setReady(true), []);
  const { reference, diversified, referenceChange, diversifiedChange, contributions } = comparePortfolios(weight, shock);
  const rows = [
    { label: "Cartera de referencia", weights: reference, value: referenceChange },
    { label: "Cartera híbrida", weights: diversified, value: diversifiedChange },
  ];

  return (
    <div className="portfolio-lab">
      <div className="portfolio-controls">
        <div className="portfolio-label"><FlaskConical size={19} aria-hidden="true" /> Simulación educativa</div>
        <p>Ambas carteras tienen 50 % de acciones. En la híbrida, los activos digitales sustituyen parte de los bonos.</p>
        <p className="portfolio-fixed">Supuestos fijos del escenario: acciones −8 %, bonos +1 %.</p>
        <fieldset disabled={!ready}>
          <legend className="sr-only">Ajusta los supuestos de la cartera híbrida</legend>
          <div className="portfolio-presets" role="group" aria-label="Escenarios de activos digitales">
            {presets.map((preset) => <button type="button" key={preset.label} aria-pressed={preset.shock === shock} onClick={() => setShock(preset.shock)}>{preset.label}</button>)}
          </div>
          <label htmlFor="hub-weight">Peso de activos digitales <span aria-hidden="true">{percentage(weight)}</span></label>
          <input id="hub-weight" type="range" min="0" max="30" step="5" value={weight} aria-valuetext={percentage(weight)} onChange={(event) => setWeight(event.currentTarget.valueAsNumber)} />
          <label htmlFor="hub-shock">Variación de activos digitales <span aria-hidden="true">{percentage(shock)}</span></label>
          <input id="hub-shock" type="range" min="-50" max="25" step="5" value={shock} aria-valuetext={percentage(shock)} onChange={(event) => setShock(event.currentTarget.valueAsNumber)} />
        </fieldset>
        <noscript><p>La comparación muestra un escenario fijo. Activa JavaScript para cambiar los supuestos.</p></noscript>
        <p className="portfolio-note">Datos ficticios de un solo período. Los cálculos excluyen costos e impuestos y no estiman resultados futuros.</p>
      </div>
      <div className="portfolio-results">
        <div className="portfolio-results-heading"><strong>Comparación de carteras</strong><span>Datos ficticios</span></div>
        <figure className="portfolio-allocation">
          <figcaption>Distribución de activos <span>(% del portafolio)</span></figcaption>
          <ul className="portfolio-legend" role="list">
            {instruments.map(({ key, label }) => <li key={key} data-instrument={key}>{label}</li>)}
          </ul>
          {rows.map(({ label, weights }) => (
            <div className="portfolio-row" key={label}>
              <p>{label} <span>{instruments.map(({ key, label: asset }) => <span key={key}><span className="sr-only">{asset}: </span>{percentage(weights[key])}</span>)}</span></p>
              <svg viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
                <rect className="portfolio-segment" data-instrument="equity" x="0" width={weights.equity} height="4" />
                <rect className="portfolio-segment" data-instrument="bonds" x={weights.equity} width={weights.bonds} height="4" />
                <rect className="portfolio-segment" data-instrument="digital" x={weights.equity + weights.bonds} width={weights.digital} height="4" />
              </svg>
            </div>
          ))}
        </figure>
        <figure className="portfolio-outcome">
          <figcaption>Variación en el escenario <span>(%)</span></figcaption>
          <div className="portfolio-scale" aria-hidden="true"><span>−20 %</span><span>0 %</span><span>+20 %</span></div>
          <div role="status" aria-atomic="true">
            {rows.map(({ label, value }) => (
              <div className="portfolio-row" key={label}>
                <p>{label} <strong>{percentage(value)}</strong></p>
                <svg viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
                  <line x1="50" x2="50" y1="0" y2="4" />
                  <rect className="portfolio-result" data-negative={value < 0} x={Math.min(50, 50 + value * 2.5)} width={Math.abs(value) * 2.5} height="4" />
                </svg>
              </div>
            ))}
          </div>
        </figure>
        <figure className="portfolio-contribution">
          <figcaption>Aporte a la variación de la cartera híbrida <span>(puntos porcentuales)</span></figcaption>
          <dl>
            {instruments.map(({ key, label }) => <div key={key}><dt>{label}</dt><dd>{formatter.format(contributions[key])}</dd></div>)}
          </dl>
          <p>El aporte de cada activo es su peso por su variación. La suma explica el resultado de la cartera.</p>
        </figure>
      </div>
    </div>
  );
}
