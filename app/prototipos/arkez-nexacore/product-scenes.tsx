"use client";

import { useState } from "react";
import { ArrowUpRight, BookOpen, Building2, Calculator, Check, ClipboardList, FileCheck2, ListChecks, SlidersHorizontal } from "lucide-react";
import { calculateCompound } from "@/lib/compound-interest";
import { evaluateProperty } from "./property";
import { number } from "./financial-chart";
import propertyPhoto from "./inmueble-ejemplo.webp";

const figureMoney = (value: number) => `${number.format(value)} M COP`;
const saving = calculateCompound({ principal: 2e6, monthly: .2e6, years: 5, annualRate: 6, compounds: 12 });
const property = { price: 300, expense: .6, income: 1.8, appreciation: 4, inflation: 3, years: 5 };

function SavingScene({ expanded }: { expanded: boolean }) {
  const [year, setYear] = useState(5);
  const row = saving.rows[year];
  const label = `Año ${year}`;
  return <div className="nx-product-surface nx-product-saving">
    <div className="nx-product-top"><BookOpen size={19} /><span>Cuaderno de ahorro</span><small>Ejemplo · 6 % nominal</small></div>
    <div className="nx-product-balance"><span>Saldo estimado · {label}</span><strong>{figureMoney(row.balance / 1e6)}</strong></div>
    <div className="nx-product-plot">
      <div className="nx-product-bars">
        {saving.rows.slice(1).map(({ year: period, balance, contributed }) => <div key={period} data-current={year === period}>
          <meter min="0" max={saving.final.balance} value={balance} aria-label={`Saldo en año ${period}`} />
          <meter min="0" max={saving.final.balance} value={contributed} aria-label={`Aportado en año ${period}`} />
        </div>)}
      </div>
      <div className="nx-product-axis"><span>Año 1</span><span>Año 5</span></div>
    </div>
    <div className="nx-product-split"><p><small>Aportes acumulados</small><b>{figureMoney(row.contributed / 1e6)}</b></p><p><small>Crecimiento hipotético</small><b>{figureMoney(row.growth / 1e6)}</b></p></div>
    {expanded && <label className="nx-product-range"><span>Explorar año</span><input aria-valuetext={label} type="range" min="1" max="5" value={year} onChange={(event) => setYear(event.currentTarget.valueAsNumber)} /><b>{year}</b></label>}
  </div>;
}

function ScenarioScene({ expanded }: { expanded: boolean }) {
  const [rate, setRate] = useState(4);
  const estimate = evaluateProperty(property, rate).at(-1)!;
  const baseline = evaluateProperty(property, 0).at(-1)!;
  return <div className="nx-product-surface nx-product-scenario">
    <div className="nx-product-top"><Building2 size={19} /><span>Escenario inmobiliario</span><small>5 años · pesos de hoy</small></div>
    <div className="nx-property-preview">
      <img src={propertyPhoto.src} width={propertyPhoto.width} height={propertyPhoto.height} alt="" loading="lazy" />
      <div><small>Diferencia frente a 0 %</small><strong>{figureMoney(estimate.real - baseline.real)}</strong></div>
    </div>
    <dl className="nx-product-comparison"><div><dt>Con {rate} % anual</dt><dd>{figureMoney(estimate.real)}</dd><dd aria-hidden="true"><meter min="0" max="400" value={estimate.real} /></dd></div><div><dt>Sin valorización</dt><dd>{figureMoney(baseline.real)}</dd><dd aria-hidden="true"><meter min="0" max="400" value={baseline.real} /></dd></div></dl>
    {expanded && <div className="nx-product-rates" role="group" aria-label="Tasa de valorización de ejemplo">
      {[-4, 4, 8].map((value) => <button type="button" key={value} aria-pressed={rate === value} onClick={() => setRate(value)}>{value > 0 ? "+" : ""}{value} %</button>)}
    </div>}
  </div>;
}

const process = [
  { title: "Diagnóstico", output: "Inventario de costos y fuentes", Icon: ClipboardList },
  { title: "Evaluación", output: "Comparación de supuestos", Icon: SlidersHorizontal },
  { title: "Decisión", output: "Criterios y pasos de seguimiento", Icon: FileCheck2 },
];
function ConsultingScene({ expanded }: { expanded: boolean }) {
  const [step, setStep] = useState(0);
  return <div className="nx-product-surface nx-product-consulting">
    <div className="nx-product-top"><ListChecks size={19} /><span>Evaluación de una compra</span><small>Caso ilustrativo</small></div>
    <ol aria-label="Ejemplo de trabajo" className="nx-consulting-steps">
      {process.map(({ title, output, Icon }, index) => <li key={title} data-current={step === index}>
        {expanded ? <button type="button" onClick={() => setStep(index)} aria-pressed={step === index}><Icon size={20} /><span><b>{title}</b><small>{output}</small></span>{step === index && <Check size={17} />}</button>
          : <div><Icon size={20} /><span><b>{title}</b><small>{output}</small></span></div>}
      </li>)}
    </ol>
    {expanded && <p className="nx-product-deliverable"><FileCheck2 size={16} /> Entregable ilustrativo · {process[step].output}</p>}
  </div>;
}

export function ProductScene({ variant, expanded = false }: { variant: number; expanded?: boolean }) {
  if (variant === 0) return <SavingScene expanded={expanded} />;
  if (variant === 1) return <ScenarioScene expanded={expanded} />;
  return <ConsultingScene expanded={expanded} />;
}

const services = [
  { tag: "Aprender", title: "Formación financiera", description: "Distingue tus aportes del crecimiento que depende de una tasa.", href: "/servicios/educacion-financiera/", Icon: BookOpen },
  { tag: "Practicar", title: "Análisis y simulación", description: "Compara cómo cambia el valor de un inmueble al variar un supuesto.", href: "/servicios/analisis-de-mercados/", Icon: Calculator },
  { tag: "Decidir", title: "Consultoría para equipos", description: "Revisa los entregables que pueden ayudar a estructurar una decisión.", href: "/servicios/consultoria-financiera/", Icon: Building2 },
] as const;

export function ServiceDeck() {
  const [selected, setSelected] = useState(0);
  return <section className="nx-services nx-pad" id="nx-servicios" aria-labelledby="nx-services-title">
    <div className="nx-wrap">
      <header className="nx-heading"><p className="nx-kicker">Servicios</p><h2 id="nx-services-title">Del concepto a la decisión.</h2></header>
      <div className="nx-products" data-selected={selected}>
        {services.map(({ tag, title, href, description, Icon }, index) => <article key={title} className="nx-product" data-expanded={selected === index}>
          <header>
            <p><Icon size={17} />{tag}</p>
            <h3><button type="button" aria-expanded={selected === index} aria-controls={`nx-service-${index}`} onClick={() => setSelected(selected === index ? -1 : index)}>{title}<span aria-hidden="true">{selected === index ? "−" : "+"}</span></button></h3>
          </header>
          <div className="nx-product-surface nx-service-brief">
            <Icon size={30} aria-hidden="true" />
            <dl>
              <div><dt>Punto de partida</dt><dd>{["Un objetivo con fecha", "Un resultado que necesita contexto", "Un problema del equipo por definir"][index]}</dd></div>
              <div><dt>Qué practicas</dt><dd>{["Plazo, liquidez y costos", "Contrastar supuestos con fuentes", "Acordar criterios y próximos pasos"][index]}</dd></div>
            </dl>
          </div>
          <div id={`nx-service-${index}`} className="nx-product-details" hidden={selected !== index}>
            <p>{description}</p><a href={href}>Explorar servicio <ArrowUpRight size={17} /></a>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
