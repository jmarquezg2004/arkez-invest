"use client";

import { useState } from "react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { ArrowRight } from "@/components/arkez-icons";
import { aiNodes, aiRelations } from "@/lib/experience-ai";
import { calculateCompound } from "@/lib/compound-interest";
import { useHashSelection } from "./interactions";
import { evaluateProperty, type PropertyInputs } from "./property";

const number = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 });
const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", currencyDisplay: "code", maximumFractionDigits: 0 });

type Series = { name: string; values: number[] };

function Chart({ series, horizontal }: { series: Series[]; horizontal: string }) {
  const reduced = useReducedMotion();
  const values = series.flatMap(({ values }) => values);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const range = high - low || 1;
  const floor = low - range * .093;
  const ceiling = high + range * .093;
  const x = (index: number) => 62 + index / Math.max(series[0].values.length - 1, 1) * 410;
  const y = (value: number) => 158 - (value - floor) / (ceiling - floor) * 133;
  return <figure className="nx-chart">
    <svg viewBox="0 0 488 180" aria-hidden="true">
      {(low === high ? [low] : [high, (low + high) / 2, low]).map((value, i) => <g key={i}><text x="4" y={y(value) + 3}>{number.format(value)}</text><path className="nx-chart-grid" d={`M62 ${y(value)}H472`} /></g>)}
      {series.map(({ name, values }, index) => {
        const line = values.map((value, step) => `${step ? "L" : "M"}${x(step)} ${y(value)}`).join(" ");
        return <motion.path key={name} className={index === 0 ? "nx-series-main" : "nx-series-ref"} d={line} animate={{ d: line }} initial={false} transition={{ duration: reduced ? 0 : .25 }} />;
      })}
      {series[0].values.length === 1 && <circle cx="62" cy={y(series[0].values[0])} r="4" />}
      <text x="62" y="174">{series[0].values.length === 1 ? horizontal : "Inicio"}</text>
      {series[0].values.length > 1 && <text x="472" y="174" textAnchor="end">{horizontal}</text>}
    </svg>
    <figcaption>{series.map(({ name, values }) => <span key={name}>{name} · <strong>{number.format(values[values.length - 1])} M COP</strong></span>)}</figcaption>
  </figure>;
}

function Slider({ label, min, max, step = 1, value, onChange, unit }: {
  label: string; min: number; max: number; step?: number; value: number; onChange: (value: number) => void; unit: string;
}) {
  return <label className="nx-slider">
    <span id={`nx-input-${label.replaceAll(" ", "-")}`}>{label}</span><b aria-hidden="true">{number.format(value)} {unit}</b>
    <input aria-labelledby={`nx-input-${label.replaceAll(" ", "-")}`} aria-valuetext={`${number.format(value)} ${unit === "M COP" ? "millones de pesos colombianos" : unit}`} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.currentTarget.valueAsNumber)} />
  </label>;
}

const propertyControls = [
  ["price", "Precio de compra", 100, 900, 10, "M COP"],
  ["expense", "Gastos mensuales", 0, 5, .1, "M COP"],
  ["income", "Ingresos mensuales", 0, 8, .1, "M COP"],
  ["appreciation", "Valorización anual", -8, 15, 1, "%"],
  ["inflation", "Inflación anual", 0, 14, 1, "%"],
  ["years", "Horizonte", 1, 20, 1, "años"],
] as const;

function PropertyLab() {
  const [inputs, setInputs] = useState<PropertyInputs>({ price: 300, expense: .6, income: 1.8, appreciation: 4, inflation: 3, years: 5 });
  const scenario = evaluateProperty(inputs);
  const reference = evaluateProperty(inputs, 0);
  const result = scenario[inputs.years];
  return <div className="nx-lab-columns">
    <div className="nx-lab-fields">{propertyControls.map(([key, label, min, max, step, unit]) => <Slider key={key} {...{ label, min, max, step, unit }} value={inputs[key]} onChange={(value) => setInputs({ ...inputs, [key]: value })} />)}</div>
    <div className="nx-lab-report">
      <p className="nx-lab-caption">Valor del inmueble en pesos de hoy</p>
      <output>{money.format(result.real * 1e6)}</output>
      <Chart series={[{ name: "Escenario elegido", values: scenario.map(({ real }) => real) }, { name: "Sin valorización", values: reference.map(({ real }) => real) }]} horizontal={`Año ${inputs.years}`} />
      <dl className="nx-metrics">
        <div><dt>Flujo neto real acumulado</dt><dd>{money.format(result.discountedCashFlow * 1e6)}</dd></div>
        <div><dt>Cambio real sobre el precio inicial</dt><dd>{money.format(result.realChange * 1e6)}</dd></div>
        <div><dt>Valor nominal al cierre</dt><dd>{money.format(result.nominal * 1e6)}</dd></div>
      </dl>
      <p className="nx-method-note">Simulación educativa. El flujo resta gastos a ingresos y descuenta cada año por inflación. Asume montos nominales constantes y excluye deuda, impuestos y costos de venta.</p>
    </div>
  </div>;
}

function AiLab() {
  const [active, setActive] = useState<(typeof aiNodes)[number]["id"]>("cloud");
  const node = aiNodes.find(({ id }) => id === active)!;
  const relations = aiRelations.filter(({ from, to }) => from === active || to === active);
  const related = new Set<string>(relations.flatMap(({ from, to }) => [from, to]));
  return <div className="nx-ai">
    <ol className="nx-ai-nodes" role="list" aria-label="Categorías de infraestructura IA">
      {aiNodes.map(({ id, title, product }, index) => <li key={id} data-related={related.has(id)}><button type="button" aria-pressed={active === id} onClick={() => setActive(id)}><span>0{index + 1}</span><strong>{title}</strong><small>{product}</small></button></li>)}
    </ol>
    <div className="nx-ai-detail">
      <div aria-live="polite"><h3>{node.title}</h3><p>{node.note}</p></div>
      <ul role="list">{relations.map(({ label, explanation, url, source }) => <li key={url}><strong>{label}</strong><p>{explanation}</p><a href={url}>{source} <ArrowRight size={15} /></a></li>)}</ul>
    </div>
    <p className="nx-method-note">Cada conexión enlaza un ejemplo técnico documentado por su proveedor.</p>
  </div>;
}

const positions = [
  { name: "ETF de acciones", platform: "Plataforma A", values: [4.2, 4.5, 4.4, 4.8, 5.1, 5.2] },
  { name: "Renta fija", platform: "Plataforma B", values: [3.1, 3.2, 3.2, 3.3, 3.3, 3.4] },
  { name: "Fondo de liquidez", platform: "Plataforma C", values: [1.4, 1.4, 1.9, 1.9, 2, 2.3] },
];
const periods = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"];

function PortfolioLab() {
  const [month, setMonth] = useState(5);
  const [platform, setPlatform] = useState("Todas");
  const rows = positions.filter((position) => platform === "Todas" || platform === position.platform);
  const values = periods.map((_, i) => rows.reduce((sum, row) => sum + row.values[i], 0));
  return <div className="nx-lab-columns">
    <div className="nx-lab-fields nx-selects">
      <p className="nx-lab-caption">Datos ficticios</p>
      <label><span id="nx-platform-label">Plataforma</span><select aria-labelledby="nx-platform-label" value={platform} onChange={(event) => setPlatform(event.currentTarget.value)}>{["Todas", ...positions.map(({ platform }) => platform)].map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span id="nx-period-label">Mes del registro</span><select aria-labelledby="nx-period-label" value={month} onChange={(event) => setMonth(Number(event.currentTarget.value))}>{periods.map((period, i) => <option key={period} value={i}>{period}</option>)}</select></label>
      <p className="nx-method-note">Los saldos de ejemplo pueden incluir aportes. Su variación no representa rentabilidad.</p>
    </div>
    <div className="nx-lab-report">
      <p className="nx-lab-caption">Saldo registrado · {periods[month]}</p>
      <output>{money.format(values[month] * 1e6)}</output>
      <Chart series={[{ name: "Evolución del saldo", values: values.slice(0, month + 1) }]} horizontal={periods[month]} />
      <ul className="nx-allocation" role="list">{rows.map(({ name, platform, values: amounts }) => {
        const share = 100 * amounts[month] / values[month];
        return <li key={name}><span>{name} · {platform}</span><strong>{money.format(amounts[month] * 1e6)} · {number.format(share)} %</strong><progress value={share} max="100" aria-label={`Distribución de ${name}`} /></li>;
      })}</ul>
    </div>
  </div>;
}

function CompoundLab() {
  const [principal, setPrincipal] = useState(2);
  const [monthly, setMonthly] = useState(.2);
  const [years, setYears] = useState(8);
  const [rate, setRate] = useState(6);
  const inputs = { principal: principal * 1e6, monthly: monthly * 1e6, years, annualRate: rate, compounds: 12 };
  const scenario = calculateCompound(inputs);
  return <div className="nx-lab-columns">
    <div className="nx-lab-fields">
      <Slider label="Capital inicial" min={0} max={30} step={.5} value={principal} onChange={setPrincipal} unit="M COP" />
      <Slider label="Aporte mensual" min={0} max={3} step={.1} value={monthly} onChange={setMonthly} unit="M COP" />
      <Slider label="Tasa nominal anual" min={-5} max={16} value={rate} onChange={setRate} unit="%" />
      <Slider label="Plazo de ahorro" min={1} max={30} value={years} onChange={setYears} unit="años" />
      <a className="nx-inline-link" href="/herramientas/interes-compuesto/">Abrir calculadora completa <ArrowRight size={16} /></a>
    </div>
    <div className="nx-lab-report">
      <p className="nx-lab-caption">Saldo estimado</p>
      <output>{money.format(scenario.final.balance)}</output>
      <Chart series={[{ name: "Con la tasa elegida", values: scenario.rows.map(({ balance }) => balance / 1e6) }, { name: "Solo aportes", values: scenario.rows.map(({ contributed }) => contributed / 1e6) }]} horizontal={`Año ${years}`} />
      <dl className="nx-metrics"><div><dt>Total aportado</dt><dd>{money.format(scenario.final.contributed)}</dd></div><div><dt>Diferencia frente a solo aportar</dt><dd>{money.format(scenario.final.growth)}</dd></div></dl>
      <p className="nx-method-note">Supuestos ilustrativos con capitalización mensual. Sin impuestos, comisiones ni inflación.</p>
    </div>
  </div>;
}

const tools = [
  { name: "Inmuebles", title: "Evaluador inmobiliario", text: "Compara el valor en pesos de hoy con un escenario sin valorización.", Component: PropertyLab },
  { name: "Infraestructura IA", title: "Mapa de infraestructura IA", text: "Selecciona un nodo para ver sus conexiones y fuentes técnicas.", Component: AiLab },
  { name: "Inversiones", title: "Panel de inversiones", text: "Cambia de plataforma o mes para ver saldos y distribución.", Component: PortfolioLab },
  { name: "Interés compuesto", title: "Simulador de interés compuesto", text: "Compara una tasa ilustrativa con un escenario de solo aportes.", Component: CompoundLab },
] as const;

export function FinancialLab() {
  const [active, setActive] = useState(0);
  useHashSelection("nx-lab-", setActive, tools.length);
  return <section className="nx-lab nx-pad" id="nx-herramientas" aria-labelledby="nx-lab-title">
    <div className="nx-wrap">
      <header className="nx-heading"><p className="nx-kicker">Herramientas</p><h2 id="nx-lab-title">Prueba antes de decidir.</h2></header>
      <div className="nx-lab-shell">
        <div className="nx-switch nx-lab-switch" role="group" aria-label="Demostraciones financieras">
          {tools.map(({ name }, index) => <button key={name} type="button" id={`nx-lab-${index}`} aria-controls={`nx-desk-${index}`} aria-pressed={active === index} onClick={() => setActive(index)}>{name}</button>)}
        </div>
        <MotionConfig reducedMotion="user">
          {tools.map(({ title, text, Component }, index) => <div key={title} className="nx-lab-desk" id={`nx-desk-${index}`} hidden={active !== index}>
            <header><h3>{title}</h3><p>{text}</p></header><Component />
          </div>)}
        </MotionConfig>
      </div>
    </div>
  </section>;
}
