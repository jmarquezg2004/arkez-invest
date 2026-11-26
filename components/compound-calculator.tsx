"use client";

import { useState, type FormEvent } from "react";
import { calculateCompound, compoundExample as initial, frequencies, validateScenario, type CompoundScenario } from "@/lib/compound-interest";
import { recordCommercialEvent } from "@/lib/commercial-events";

const currencies = ["COP", "USD", "EUR"] as const;
type Currency = typeof currencies[number];
type Draft = { [Key in keyof CompoundScenario]: string };

function draft(scenario: CompoundScenario): Draft {
  return {
    principal: String(scenario.principal), monthly: String(scenario.monthly), years: String(scenario.years),
    annualRate: String(scenario.annualRate), compounds: String(scenario.compounds),
  };
}

const numericFields = [
  { key: "principal", label: "Capital inicial", min: 0, max: 1e12, step: "any" },
  { key: "monthly", label: "Aporte mensual", min: 0, max: 1e12, step: "any" },
  { key: "years", label: "Plazo en años", min: 1, max: 50, step: 1 },
  { key: "annualRate", label: "Tasa anual nominal (%)", min: -99, max: 100, step: "any" },
] as const;

function CompoundFields({ name, values, update }: {
  name: string;
  values: Draft;
  update: (key: keyof Draft, value: string) => void;
}) {
  return (
    <fieldset className="compound-fields">
      <legend>{name}</legend>
      {numericFields.map(({ key, label, ...limits }) => (
        <label key={key}>
          {label}
          <input type="number" inputMode={key === "years" ? "numeric" : "decimal"} required
            {...limits} value={values[key]} onChange={(event) => update(key, event.target.value)} />
        </label>
      ))}
      <label>Capitalización
        <select value={values.compounds} onChange={(event) => update("compounds", event.target.value)}>
          {frequencies.map(({ value, label }) => <option value={value} key={value}>{label}</option>)}
        </select>
      </label>
    </fieldset>
  );
}

function parse(values: Draft): CompoundScenario {
  return {
    principal: Number(values.principal), monthly: Number(values.monthly), years: Number(values.years),
    annualRate: Number(values.annualRate), compounds: Number(values.compounds),
  };
}

function CompoundChart({ scenarios, currency }: {
  scenarios: ReturnType<typeof calculateCompound>[];
  currency: Currency;
}) {
  const maximum = Math.max(1, ...scenarios.flatMap(({ rows }) => rows.flatMap(({ balance, contributed }) => [balance, contributed])));
  const lastYear = Math.max(...scenarios.map(({ final }) => final.year));
  const y = (balance: number) => 188 - 163 * balance / maximum;
  const x = (year: number) => 67 + 387 * year / lastYear;
  const levels = [0, .5, 1];
  const formatter = new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 1 });

  return (
    <figure className="compound-chart">
      <figcaption>Capital al cierre de cada año ({currency})</figcaption>
      <svg viewBox="0 0 470 226" role="img" aria-label="Evolución anual con tasa y ahorro sin intereses. Los valores exactos están en la tabla anual.">
        {levels.map((level) => (
          <g key={level}>
            <path className="compound-gridline" d={`M67 ${y(maximum * level)}H454`} />
            <text x="60" y={y(maximum * level) + 4} textAnchor="end">{formatter.format(maximum * level)}</text>
          </g>
        ))}
        <text x={x(0)} y="211">Año 0</text>
        <text x={x(lastYear)} y="211" textAnchor="end">Año {lastYear}</text>
        {scenarios.map(({ rows }, index) => (
          <g key={index} data-scenario={index === 0 ? "a" : "b"}>
            <polyline className={index === 0 ? "compound-line-a" : "compound-line-b"}
              points={rows.map(({ year, balance }) => `${x(year)},${y(balance)}`).join(" ")} />
            <polyline className="compound-line-cash" points={rows.map(({ year, contributed }) => `${x(year)},${y(contributed)}`).join(" ")} />
          </g>
        ))}
      </svg>
      <p className="compound-legend"><span>A · con tasa</span><span data-line="cash">A · sin intereses</span>{scenarios.length > 1 && <><span data-line="b">B · con tasa</span><span data-line="cash-b">B · sin intereses</span></>}</p>
    </figure>
  );
}

export function CompoundCalculator() {
  const [first, setFirst] = useState(() => draft(initial));
  const [second, setSecond] = useState(() => draft({ ...initial, annualRate: 3 }));
  const [comparing, setComparing] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [results, setResults] = useState(() => [calculateCompound(initial)]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const money = new Intl.NumberFormat("es-CO", {
    style: "currency", currency, currencyDisplay: "code", maximumFractionDigits: currency === "COP" ? 0 : 2,
  });

  function changeComparison() {
    setComparing(!comparing);
    setStatus("");
    setError("");
    if (comparing && results.length > 1) setResults([results[0]]);
    if (!comparing) recordCommercialEvent({ type: "calculator_use", action: "compare" });
  }

  function run(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const scenarios = comparing ? [parse(first), parse(second)] : [parse(first)];
    const nextError = scenarios.map(validateScenario).find(Boolean);
    if (nextError) {
      setError(nextError);
      return;
    }
    setError("");
    const estimates = scenarios.map(calculateCompound);
    setResults(estimates);
    setStatus(estimates.map(({ final }, index) =>
      `Capital final del escenario ${index === 0 ? "A" : "B"}: ${money.format(final.balance)}.`).join(" "));
    recordCommercialEvent({ type: "calculator_use", action: "calculate" });
  }

  return (
    <section className="compound-calculator" aria-labelledby="compound-heading">
      <h2 id="compound-heading">Simula tus ahorros</h2>
      <p id="compound-assumptions">Los aportes se suman al final de cada mes. Se aplica una tasa mensual equivalente a la capitalización que elijas.</p>
      <noscript><p>Activa JavaScript para calcular. También puedes abrir la calculadora de Investor.gov enlazada más abajo.</p></noscript>
      <div className="compound-workspace">
        <form className="compound-controls" onSubmit={run} aria-describedby="compound-assumptions">
          <CompoundFields name="Escenario A" values={first} update={(key, value) => setFirst({ ...first, [key]: value })} />
          <label className="compound-currency">Moneda
            <select value={currency} onChange={(event) => {
              const choice = currencies.find((item) => item === event.target.value);
              if (choice) setCurrency(choice);
              setStatus("");
            }}>
              <option value="COP">COP · peso colombiano</option>
              <option value="USD">USD · dólar estadounidense</option>
              <option value="EUR">EUR · euro</option>
            </select>
          </label>
          <p>La moneda cambia la unidad de los importes. No convierte valores.</p>
          {comparing && <CompoundFields name="Escenario B" values={second} update={(key, value) => setSecond({ ...second, [key]: value })} />}
          <div className="compound-actions">
            <button type="submit" className="button button-dark">Calcular</button>
            <button type="button" className="button button-outline" aria-pressed={comparing} onClick={changeComparison}>
              {comparing ? "Quitar comparación" : "Añadir comparación"}
            </button>
          </div>
          {error && <p role="alert">{error}</p>}
        </form>
        <div className="compound-result">
          <h3>Resultados estimados</h3>
          <p role="status" className="sr-only">{status}</p>
          {results.map(({ final }, index) => (
            <dl key={index} aria-label={index === 0 ? "Escenario A" : "Escenario B"}>
              <div className="compound-total"><dt>Capital final{results.length > 1 && (index === 0 ? " · A" : " · B")}</dt><dd>{money.format(final.balance)}</dd></div>
              <div><dt>Ahorro sin intereses</dt><dd>{money.format(final.contributed)}</dd></div>
              <div><dt>Diferencia frente al ahorro sin intereses</dt><dd>{money.format(final.growth)}</dd></div>
            </dl>
          ))}
          <CompoundChart scenarios={results} currency={currency} />
          <details className="compound-yearly">
            <summary>Consultar tabla anual</summary>
            {results.map(({ rows }, index) => (
              <table key={index}>
                <caption>{index === 0 ? "Escenario A" : "Escenario B"} ({currency})</caption>
                <thead><tr><th scope="col">Año</th><th scope="col">Aportado</th><th scope="col">Capital</th></tr></thead>
                <tbody>{rows.map(({ year, contributed, balance }) => (
                  <tr key={year}><th scope="row">{year}</th><td>{money.format(contributed)}</td><td>{money.format(balance)}</td></tr>
                ))}</tbody>
              </table>
            ))}
          </details>
        </div>
      </div>
      <p className="compound-disclaimer">Ejercicio educativo con tasa constante. Los resultados pueden ser negativos y excluyen inflación, costos e impuestos. No representan una rentabilidad garantizada.</p>
    </section>
  );
}
