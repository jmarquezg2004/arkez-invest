import { ArrowUpRight, FileChartColumn, Network } from "lucide-react";
import { Financials } from "@/arkez-visual-engine/components/financials";
import { ArtImage } from "@/arkez-visual-engine/components/art";
import { ExportActions } from "@/arkez-visual-engine/renderers/exports";
import { MarketLookup } from "./market-lookup";
import { base } from "./routes";

const oddity = base + "/research/oddity/";
const oddSource = "https://www.sec.gov/Archives/edgar/data/1907085/000110465926125812/tm2629351d1_ex99-1.htm";
const oddReports = [
  { name: "Informe empresarial", detail: "Resultados y margen · 3T 2026", href: oddity + "informe/", art: "report", Icon: FileChartColumn },
  { name: "Modelo de negocio", detail: "Marcas, ingresos y proveedores", href: oddity + "modelo/", art: "chain", Icon: Network },
] as const;

export function ReportLibrary({ companyOnly = false }: { companyOnly?: boolean }) {
  return <div className="ve ai-library">
    <section className="ve-explore-hero ai-library-hero">
      <ArtImage art={companyOnly ? "report" : "study"} eager />
      <div><p className="ve-kicker">Arkez Research</p>
        <h1>{companyOnly ? "ODDITY Tech · ODD" : "Informes empresariales"}</h1>
        <p>{companyOnly ? "Entiende cómo vende ODDITY, quién le paga y qué pasó con sus márgenes." : "Elige un caso de estudio para leer sus cifras, entender el negocio y consultar las fuentes."}</p>
      </div>
    </section>
    <div className="container-shell ai-library-body">
      {!companyOnly && <MarketLookup />}
      {!companyOnly && <section className="ve-shelf"><header><h2>Nubank</h2></header><ul className="ve-track" role="list"><li className="ve-cover" data-palette="purple">
        <ArtImage art="bank" /><a className="ve-cover-open" href={base + "/explore/nubank/"}><span>NU</span><strong>Galería de Nubank</strong><small>Seis recursos de investigación</small><ArrowUpRight size={19} /></a>
      </li></ul></section>}
      <section className="ve-shelf"><header><h2>{companyOnly ? "Recursos de ODDITY" : "ODDITY Tech"}</h2>{!companyOnly && <a className="ai-library-link" href={oddity}>Ver caso ODDITY <ArrowUpRight size={16} /></a>}</header>
        <ul className="ve-track" role="list">{oddReports.map(({ name, detail, href, art, Icon }) => <li key={href} className="ve-cover" data-palette="gold">
          <ArtImage art={art} /><a className="ve-cover-open" href={href}><span><Icon size={14} /> ODD</span><strong>{name}</strong><small>{detail}</small><ArrowUpRight size={19} /></a>
        </li>)}</ul>
      </section>
    </div>
  </div>;
}

export function OddityReport({ model = false }: { model?: boolean }) {
  const title = model ? "Modelo de negocio de ODDITY" : "Informe empresarial de ODDITY";
  return <article className="ve ve-research ve-document">
    <div className="ve-company-hero"><ArtImage art="report" eager /><div className="ve-company-intro"><p className="ve-kicker">Arkez Research · NASDAQ: ODD</p><h1>{title}</h1><p>Resultados históricos del tercer trimestre de 2026.</p></div></div>
    <div className="ve-research-body" id="ve-resource-body">
      <nav className="ve-breadcrumb" aria-label="Recursos de ODDITY"><a href={oddity}>← Recursos de ODDITY</a></nav>
      <ExportActions slug={model ? "oddity-modelo" : "oddity-informe"} />
      {model ? <>
        <section className="ve-document-section"><h2>Quién paga y por qué</h2><p>ODDITY vende maquillaje, cuidado personal y servicios de dermatología digital al consumidor. En el 3T de 2026, sus propias webs aportaron US$138,7 M, el 95,7 % de sus ingresos netos.</p>
          <div className="ve-model"><ol>{[["Atracción","Publicidad y redes"],["Elección","Recomendaciones en la web"],["Compra","El cliente paga a ODDITY"],["Entrega","Transporte y recompra"]].map(([label, text]) => <li key={label}><h3>{label}</h3><p>{text}</p></li>)}</ol></div>
        </section>
        <section className="ve-document-section"><h2>Marcas y proveedores</h2><ul><li><strong>IL MAKIAGE:</strong> maquillaje.</li><li><strong>SpoiledChild:</strong> cuidado de la piel y del cabello.</li><li><strong>METHODIQ:</strong> dermatología digital.</li></ul><p>Las marcas mencionan UPS, FedEx y DHL para ciertos envíos o devoluciones. ODDITY también contrata fabricación y compra ingredientes y envases a terceros.</p>
          <p className="ve-source"><a href="https://www.ilmakiage.com/us-es/faq/">Envíos de IL MAKIAGE</a><a href="https://www.spoiledchild.com/faq">Envíos de SpoiledChild</a></p>
        </section>
      </> : <>
        <section className="ve-document-section"><h2>Las ganancias cayeron más que las ventas</h2><p>El costo de los ingresos subió un 12,6 % mientras los ingresos netos bajaron un 2,0 %. El ahorro en gastos de venta y administración compensó parte de la caída del beneficio bruto.</p></section>
        <section className="ve-stats"><h2>Comparación del trimestre</h2><table aria-label="Resultados de ODDITY en 2025 y 2026"><thead><tr><th scope="col">Indicador</th><th scope="col">3T 2025</th><th scope="col">3T 2026</th></tr></thead><tbody>
          {[["Ingresos netos","US$147,9 M","US$145,0 M"],["Margen bruto","71,6 %","67,4 %"],["Beneficio neto","US$17,7 M","US$11,2 M"]].map(([label, before, after]) => <tr key={label}><th scope="row">{label}</th><td>{before}</td><td>{after}</td></tr>)}
        </tbody></table></section>
        <Financials company="oddity" period="Tercer trimestre de 2025 y 2026" epsKind="diluido" data={[
          { year: "3T 2025", revenue: 147.902, gross: 105.886, net: 17.745, eps: .28 },
          { year: "3T 2026", revenue: 144.981, gross: 97.680, net: 11.195, eps: .23 },
        ]} />
        <section className="ve-document-section"><h2>Continúa con el modelo de negocio</h2><p>Revisa quién paga a ODDITY, qué vende cada marca y qué servicios contrata.</p><a className="ai-library-link" href={oddity + "modelo/"}>Ver modelo de negocio <ArrowUpRight size={16} /></a></section>
      </>}
      <p className="ve-source"><a href={oddSource}>Resultados de ODDITY · SEC <ArrowUpRight size={16} /></a><span>Trimestre cerrado el 30 de septiembre de 2026.</span></p>
    </div>
  </article>;
}
