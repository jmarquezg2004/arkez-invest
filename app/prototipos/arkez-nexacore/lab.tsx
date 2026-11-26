"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "motion/react";
import { ArrowRight } from "lucide-react";
import { calculateCompound } from "@/lib/compound-interest";
import { useHashSelection } from "./interactions";
import { evaluateProperty, type PropertyInputs } from "./property";
import { FinancialChart, money, number } from "./financial-chart";

const AiNetwork = dynamic(() => import("./ai-network").then(({ AiNetwork }) => AiNetwork), {
  ssr: false,
  loading: () => <p role="status">Cargando mapa de infraestructura…</p>,
});

const yearsLabels = (length: number) => Array.from({ length }, (_, index) => index === 0 ? "Inicio" : `Año ${index}`);

function Slider({ label, min, max, step = 1, value, onChange, unit }: {
  label: string; min: number; max: number; step?: number; value: number; onChange: (value: number) => void; unit: string;
}) {
  return <label className="nx-slider">
    <span id={`nx-input-${label.replaceAll(" ", "-")}`}>{label}</span><b aria-hidden="true">{number.format(value)} {unit}</b>
    <input aria-labelledby={`nx-input-${label.replaceAll(" ", "-")}`} aria-valuetext={`${number.format(value)} ${unit === "mil USD" ? "miles de dólares estadounidenses" : unit}`} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.currentTarget.valueAsNumber)} />
  </label>;
}

const propertyControls = [
  ["price", "Precio de compra", 100, 900, 10, "mil USD"],
  ["expense", "Gastos mensuales", 0, 5, .1, "mil USD"],
  ["income", "Ingresos mensuales", 0, 8, .1, "mil USD"],
  ["appreciation", "Valorización anual", -8, 15, 1, "%"],
  ["inflation", "Inflación anual", 0, 14, 1, "%"],
  ["years", "Horizonte", 1, 20, 1, "años"],
] as const;

function PropertyLab() {
  const [inputs, setInputs] = useState<PropertyInputs>({ price: 300, expense: .6, income: 1.8, appreciation: 4, inflation: 3, years: 5 });
  const [view, setView] = useState<"value" | "flow">("value");
  const scenario = evaluateProperty(inputs);
  const reference = evaluateProperty(inputs, 0);
  const result = scenario[inputs.years];
  return <div className="nx-lab-columns">
    <div className="nx-lab-fields">{propertyControls.map(([key, label, min, max, step, unit]) => <Slider key={key} {...{ label, min, max, step, unit }} value={inputs[key]} onChange={(value) => setInputs({ ...inputs, [key]: value })} />)}</div>
    <div className="nx-lab-report">
      <p className="nx-lab-caption">Valor del inmueble en dólares de hoy</p>
      <output>{money.format(result.real * 1e3)}</output>
      <div className="nx-switch nx-chart-switch" role="group" aria-label="Lectura del evaluador">
        <button type="button" aria-pressed={view === "value"} onClick={() => setView("value")}>Valor del inmueble</button>
        <button type="button" aria-pressed={view === "flow"} onClick={() => setView("flow")}>Flujo y resultado real</button>
      </div>
      {view === "value" ? <FinancialChart key="value" title="Valor del inmueble" periods={yearsLabels(scenario.length)} series={[
        { name: "Real en dólares de hoy", values: scenario.map(({ real }) => real) },
        { name: "Nominal al cierre", values: scenario.map(({ nominal }) => nominal) },
        { name: "Real sin valorización", values: reference.map(({ real }) => real) },
      ]} /> : <FinancialChart key="flow" title="Flujo acumulado y resultado" periods={yearsLabels(scenario.length)} series={[
        { name: "Flujo neto real acumulado", values: scenario.map(({ discountedCashFlow }) => discountedCashFlow) },
        { name: "Resultado real total", values: scenario.map(({ realChange }) => realChange) },
      ]} />}
      <dl className="nx-metrics">
        <div><dt>Flujo neto real acumulado</dt><dd>{money.format(result.discountedCashFlow * 1e3)}</dd></div>
        <div><dt>Resultado real total</dt><dd>{money.format(result.realChange * 1e3)}</dd></div>
        <div><dt>Valor nominal al cierre</dt><dd>{money.format(result.nominal * 1e3)}</dd></div>
      </dl>
      <p className="nx-method-note">Simulación educativa. El flujo resta gastos a ingresos y descuenta cada año por inflación. Asume montos nominales constantes y excluye deuda, impuestos y costos de venta.</p>
    </div>
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
      <p className="nx-method-note">Registro simulado de enero a junio. Los montos en dólares estadounidenses se definieron para este ejercicio y pueden incluir aportes. El panel suma los saldos del mes y calcula el peso de cada posición. No aplica tasas ni estima rentabilidad.</p>
    </div>
    <div className="nx-lab-report">
      <p className="nx-lab-caption">Saldo registrado · {periods[month]}</p>
      <output>{money.format(values[month] * 1e3)}</output>
      <FinancialChart title="Historial del saldo" periods={periods.slice(0, month + 1)} series={[{ name: "Saldo registrado", values: values.slice(0, month + 1) }]} />
      <ul className="nx-allocation" role="list">{rows.map(({ name, platform, values: amounts }) => {
        const share = 100 * amounts[month] / values[month];
        return <li key={name}><span>{name} · {platform}</span><strong>{money.format(amounts[month] * 1e3)} · {number.format(share)} %</strong><progress value={share} max="100" aria-label={`Distribución de ${name}`} /></li>;
      })}</ul>
    </div>
  </div>;
}

function CompoundLab() {
  const [principal, setPrincipal] = useState(2);
  const [monthly, setMonthly] = useState(.2);
  const [years, setYears] = useState(8);
  const [rate, setRate] = useState(6);
  const inputs = { principal: principal * 1e3, monthly: monthly * 1e3, years, annualRate: rate, compounds: 12 };
  const scenario = calculateCompound(inputs);
  return <div className="nx-lab-columns">
    <div className="nx-lab-fields">
      <Slider label="Capital inicial" min={0} max={30} step={.5} value={principal} onChange={setPrincipal} unit="mil USD" />
      <Slider label="Aporte mensual" min={0} max={3} step={.1} value={monthly} onChange={setMonthly} unit="mil USD" />
      <Slider label="Tasa nominal anual" min={-5} max={16} value={rate} onChange={setRate} unit="%" />
      <Slider label="Plazo de ahorro" min={1} max={30} value={years} onChange={setYears} unit="años" />
      <a className="nx-inline-link" href="/herramientas/interes-compuesto/">Abrir calculadora completa <ArrowRight size={16} /></a>
    </div>
    <div className="nx-lab-report">
      <p className="nx-lab-caption">Saldo estimado</p>
      <output>{money.format(scenario.final.balance)}</output>
      <FinancialChart title="Evolución del ahorro" periods={yearsLabels(scenario.rows.length)} series={[
        { name: "Con la tasa elegida", values: scenario.rows.map(({ balance }) => balance / 1e3) },
        { name: "Solo aportes acumulados", values: scenario.rows.map(({ contributed }) => contributed / 1e3) },
        { name: "Rendimiento hipotético", values: scenario.rows.map(({ growth }) => growth / 1e3) },
      ]} />
      <dl className="nx-metrics"><div><dt>Total aportado</dt><dd>{money.format(scenario.final.contributed)}</dd></div><div><dt>Diferencia frente a solo aportar</dt><dd>{money.format(scenario.final.growth)}</dd></div></dl>
      <p className="nx-method-note">Supuestos ilustrativos con capitalización mensual. Sin impuestos, comisiones ni inflación.</p>
    </div>
  </div>;
}

const tools = [
  { name: "Inmuebles", title: "Evaluador inmobiliario", text: "Compara el valor en dólares de hoy con un escenario sin valorización.", Component: PropertyLab },
  { name: "Infraestructura IA", title: "Mapa de infraestructura IA", text: "Selecciona un nodo para ver sus conexiones y fuentes técnicas.", Component: AiNetwork },
  { name: "Inversiones", title: "Panel de inversiones", text: "Cambia de plataforma o mes para ver saldos y distribución.", Component: PortfolioLab },
  { name: "Interés compuesto", title: "Simulador de interés compuesto", text: "Compara una tasa ilustrativa con un escenario de solo aportes.", Component: CompoundLab },
] as const;

export function FinancialLab() {
  const [active, setActive] = useState(0);
  const [openedMap, setOpenedMap] = useState(false);
  useEffect(() => { if (active === 1) setOpenedMap(true); }, [active]);
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
            <header><h3>{title}</h3><p>{text}</p></header>{(index !== 1 || openedMap || active === 1) && <Component visible={active === index} />}
          </div>)}
        </MotionConfig>
      </div>
    </div>
  </section>;
}
