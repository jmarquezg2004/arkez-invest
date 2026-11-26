import { ArrowUpRight, BookOpen, Building2, Database, Landmark, Layers3 } from "lucide-react";
import { ecosystemSections } from "@/lib/external-directory";
import { base, learningPathRoute, visualStoriesPath } from "./routes";
import { EcosystemInterest } from "./ecosystem-interest";
import { platforms } from "./ecosystem-data";

const information = [
  { name: "TradingView", description: "Cobertura por bolsa y retraso de cotizaciones.", href: "https://www.tradingview.com/data-coverage/" },
  { name: "SEC EDGAR", description: "Estados y documentos oficiales de empresas registradas en la SEC.", href: "https://www.sec.gov/search-filings" },
  { name: "FINRA BrokerCheck", description: "Registro de firmas e intermediarios en Estados Unidos.", href: "https://brokercheck.finra.org/" },
  { name: "CoinGecko", description: "Metodología para interpretar sus datos sobre mercados de activos digitales.", href: "https://www.coingecko.com/en/methodology" },
];

export function Ecosystem() {
  return <div className="ai-ecosystem">
    <nav className="directory-nav" aria-label="Categorías del ecosistema">
      <a href="#brokers">Brókers</a><a href="#activos-digitales">Exchanges</a><a href="#mercados">Bolsas y mercados</a><a href="#datos">Datos y registros</a><a href="#fintech">Fintech</a><a href="#formacion">Formación</a>
    </nav>
    {(["Bróker", "Exchange"] as const).map((type) => {
      const broker = type === "Bróker";
      const Icon = broker ? Landmark : Layers3;
      const id = broker ? "brokers" : "activos-digitales";
      return <section className="ai-eco-section" id={id} key={type} aria-labelledby={id + "-titulo"}>
        <h2 id={id + "-titulo"}><Icon aria-hidden="true" />{broker ? "Brókers de valores" : "Exchanges de activos digitales"}</h2>
        <ul className="ai-eco-grid" role="list">{platforms.filter((item) => item.type === type).map(({ name, scope, costs, check, href }) => <li key={name}>
          <h3>{name}</h3><p>{scope}</p>
          <dl><div><dt>Cómo cobra</dt><dd>{costs}</dd></div><div><dt>Qué comprobar</dt><dd>{check}</dd></div></dl>
          <a href={href}>Fuente de tarifas de {name} <ArrowUpRight size={16} aria-hidden="true" /></a>
        </li>)}</ul>
      </section>;
    })}
    {[...ecosystemSections.filter(({ id }) => id !== "activos-digitales"), { id: "datos", title: "Datos y registros públicos", sources: information }].map(({ id, title, sources }) => {
      const Icon = id === "mercados" ? Building2 : id === "datos" ? Database : id === "fintech" ? Layers3 : BookOpen;
      return <section className="ai-eco-section" id={id} key={id} aria-labelledby={id + "-titulo"}>
        <h2 id={id + "-titulo"}><Icon aria-hidden="true" />{id === "mercados" ? "Bolsas y mercados" : title}</h2>
        <ul className="ai-eco-grid" role="list">{sources.map(({ name, description, href }) => <li key={name}><h3><a href={href}>{name} <ArrowUpRight size={16} aria-hidden="true" /></a></h3><p>{description}</p></li>)}</ul>
        {id === "fintech" && <a className="avs-reading-link" href={visualStoriesPath + "#historia-pagos"}>Ver el ejemplo ilustrado sobre pagos en Research</a>}
        {id === "datos" && <a className="ai-eco-data-link" href={base + "/research/#consultar-ticker"}>Consultar un ticker en Research <ArrowUpRight size={16} aria-hidden="true" /></a>}
      </section>;
    })}
    <p className="directory-note">Directorio educativo, sin afiliación comercial. Las tarifas y condiciones dependen del país, la entidad y el producto. Fuentes consultadas el <time dateTime="2026-11-25">25 de noviembre de 2026</time>.</p>
    <section className="ai-eco-next" aria-labelledby="ai-eco-next-title">
      <div><h2 id="ai-eco-next-title">¿Cuál es el mejor para mi perfil?</h2>
        <p>Empieza por definir qué quieres aprender. La ruta te lleva a guías, casos y simuladores para comparar costos, custodia y fuentes.</p>
        <a className="ve-cta" href={base + learningPathRoute}>Encuentra tu ruta gratuita <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
      <div><h3>Propuestas de planes educativos</h3>
        <details><summary>Guía de comparación · US$5</summary><p>Propuesta: lista de criterios, glosario y ejemplos de costos para practicar.</p></details>
        <details><summary>Taller autoguiado · US$10</summary><p>Propuesta: guía, plantilla de escenarios y un caso resuelto con cifras ficticias.</p></details>
        <p>Precios de referencia para la vista previa. Los planes aún no están a la venta.</p>
        <a className="avs-reading-link" href={base + "/contacto/"}>Solicitar una conversación para cotizar consultoría</a>
        <EcosystemInterest />
      </div>
    </section>
  </div>;
}
