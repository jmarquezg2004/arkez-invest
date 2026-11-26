import { ArrowRight, ArrowUpRight, BadgeDollarSign, ChartColumnIncreasing, Check, CircleAlert, ClipboardList, Coins, FileChartColumn, Globe2, Layers3, Network, Users } from "lucide-react";
import { ArtImage } from "../components/art";
import { base } from "../components/shell";
import { Financials } from "../components/financials";
import { Markets } from "../components/markets";
import { ExportActions } from "../renderers/exports";
import { resourceTypes, type Research, type ResourceId } from "../schemas/research";

const icons = [FileChartColumn, ClipboardList, ChartColumnIncreasing, Globe2, Network, Layers3];
const metricIcons = [Users, Coins, ChartColumnIncreasing, BadgeDollarSign];
const companyPath = (data: Research) => `${base}${data.slug}/`;

function CompanyHero({ data, title }: { data: Research; title?: string }) {
  return <section className="ve-company-hero"><ArtImage art="bank" eager />
    <div className="ve-company-intro"><p className="ve-kicker">Arkez Research / {title ?? "Empresa"}</p>
      <div className="ve-identity"><span aria-hidden="true">{data.ticker}</span><div><h1>{title ?? data.name}</h1><p>{title ? data.name + " · " : ""}{data.legalName} · {data.ticker} / {data.exchange}</p></div></div>
      <p>{data.summary}</p><span className="ve-period">{data.period}</span>
    </div></section>;
}

function Indicators({ data }: { data: Research }) {
  return <dl className="ve-indicators">{data.indicators.map(({ label, value, detail }, index) => {
    const Icon = metricIcons[index % metricIcons.length];
    return <div key={label}><Icon size={24} /><dt>{label}</dt><dd>{value}<small>{detail}</small></dd></div>;
  })}</dl>;
}

function SourceLine({ data }: { data: Research }) {
  return <p className="ve-source"><a href={data.source.href}>{data.source.title} <ArrowUpRight size={15} /></a><span>Publicado el {data.source.published} · {data.source.time ?? "hora de publicación sin confirmar"} · {data.period}</span><a href={data.accounts.href}>{data.accounts.title} <ArrowUpRight size={15} /></a></p>;
}

export function ResearchIndex({ data }: { data: Research }) {
  return <article className="ve-research">
    <CompanyHero data={data} />
    <div className="ve-research-body">
      <div className="ve-section-heading"><div><p className="ve-kicker">Caso de estudio</p><h2>Recursos de la empresa</h2></div><span>6 recursos · Lectura histórica</span></div>
      <ul className="ve-resource-grid" role="list">{resourceTypes.map(({ id, title, detail, art }, index) => {
        const Icon = icons[index];
        return <li key={id}><a href={companyPath(data) + id + "/"}><div className="ve-resource-image"><ArtImage art={art} /><Icon size={43} strokeWidth={1.55} /><span><ArrowUpRight size={19} /></span></div>
          <div className="ve-resource-caption"><Icon size={25} /><span><strong>{title}</strong><small>{detail}</small></span><ArrowRight size={20} /></div></a></li>;
      })}</ul>
      <SourceLine data={data} />
    </div>
  </article>;
}

function Profile({ data }: { data: Research }) {
  return <section className="ve-document-section"><h2>Ficha de la empresa</h2><dl className="ve-profile">
    <div><dt>Emisor</dt><dd>{data.legalName}</dd></div><div><dt>Mercado y ticker</dt><dd>{data.exchange} · {data.ticker}</dd></div>
    <div><dt>Actividad</dt><dd>Servicios financieros digitales</dd></div><div><dt>Mercados del caso</dt><dd>{data.markets.map(({ name }) => name).join(", ")}</dd></div>
  </dl></section>;
}

function Model({ data }: { data: Research }) {
  const symbols = [Users, Coins, BadgeDollarSign, Layers3];
  return <section className="ve-document-section"><h2>Cómo se relacionan las actividades</h2><div className="ve-model">
    <div className="ve-model-core"><Layers3 size={26} /><strong>Plataforma digital</strong></div>
    <ol>{data.model.map(({ title, detail }, i) => {
      const Icon = symbols[i % symbols.length];
      return <li key={title}><Icon size={25} /><div><h3>{title}</h3><p>{detail}</p></div></li>;
    })}</ol>
  </div></section>;
}

function Reading({ data }: { data: Research }) {
  return <section className="ve-document-section"><h2>Fortalezas y riesgos</h2><div className="ve-read">
    <div><h3>Fortalezas observadas</h3><ul>{data.strengths.map((label) => <li key={label}><Check size={18} />{label}</li>)}</ul></div>
    <div><h3>Riesgos para estudiar</h3><ul>{data.risks.map((label) => <li key={label}><CircleAlert size={18} />{label}</li>)}</ul></div>
  </div><div className="ve-conclusion"><h3>Conclusión educativa</h3><p>{data.conclusion}</p></div></section>;
}

export function ResearchResource({ data, id }: { data: Research; id: ResourceId }) {
  const resource = resourceTypes.find((item) => item.id === id)!;
  const full = id === "estudio";
  return <article className="ve-research ve-document">
    <CompanyHero data={data} title={resource.title} />
    <div className="ve-research-body" id="ve-resource-body">
      <nav className="ve-breadcrumb" aria-label={`Recursos de ${data.name}`}><a href={companyPath(data)}>← Recursos de {data.name}</a><span>{resource.title}</span></nav>
      <ExportActions slug={`${data.slug}-${id}`} />
      <h2 className="ve-document-title">{resource.title} · {data.name}</h2>
      {(id === "informe" || id === "ficha") && <Indicators data={data} />}
      {id === "ficha" && <Profile data={data} />}
      {(id === "graficos" || id === "informe") && <Financials data={data.financials} period="Ejercicios 2024 y 2025" company={data.slug} />}
      {id === "mapa" && <Markets markets={data.markets} />}
      {id === "modelo" && <Model data={data} />}
      {id === "informe" && <Reading data={data} />}
      {full && <section className="ve-document-section">
        <h3>Investiga el caso en tres pasos</h3>
        <ol>
          <li><a href={companyPath(data) + "modelo/"}>Identifica quién paga</a> y separa los ingresos del crédito de los de otros servicios.</li>
          <li><a href={companyPath(data) + "graficos/"}>Compara ingresos y beneficio bruto</a>. Calcula el margen bruto dividiendo beneficio bruto entre ingresos.</li>
          <li><a href={companyPath(data) + "mapa/"}>Contrasta los mercados</a> e identifica una pregunta sobre cuál puede explicar el cambio.</li>
        </ol>
        <p>Pregunta de cierre. ¿Qué pudo hacer que en 2025 creciera el beneficio bruto en dólares y al mismo tiempo bajara el margen?</p>
        <details><summary>Comparar con la explicación</summary><p>Los costos directos aumentaron más rápido que los ingresos. El margen bruto pasó de aproximadamente 45,6 % a 42,0 %. Revisa los gastos financieros y las pérdidas crediticias en los estados auditados.</p></details>
      </section>}
      <SourceLine data={data} />
    </div>
  </article>;
}
