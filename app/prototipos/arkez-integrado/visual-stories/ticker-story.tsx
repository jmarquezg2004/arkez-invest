import { ArrowUpRight } from "lucide-react";
import type { CatalogItem } from "@/arkez-visual-engine/catalog";
import { base } from "../routes";
import tradeDeskArt from "./ttd-vinetas.webp";

type Filing = { form: string; date: string; href: string };
const tradeDeskFiling = { form: "10-K", date: "2026-02-27", href: "https://www.sec.gov/Archives/edgar/data/1671933/000167193326000014/ttd-20251231.htm" };
const chapters = ["Qué hace", "De dónde sale el dinero", "Qué conviene revisar", "Dónde comprobarlo"];
const models: Record<string, [string, string]> = {
  TTD: ["Las agencias y los anunciantes pagan por usar la plataforma. La tarifa suele depender del gasto del cliente. La empresa también cobra por datos y servicios adicionales.", "Distingue el gasto total que pasa por la plataforma de los ingresos que la empresa reconoce. Compara ambos conceptos en el 10-K."],
  AAPL: ["Vende dispositivos y presta servicios. Pagan quienes compran un equipo o usan servicios de pago.", "Contrasta las ventas de dispositivos con las de servicios y compara sus márgenes."],
  MSFT: ["Cobra por licencias, suscripciones y uso de nube. Sus clientes incluyen hogares, empresas y gobiernos.", "Distingue las suscripciones del consumo medido de Azure y compara el costo de ampliar su infraestructura."],
  GOOGL: ["Los anunciantes pagan por mostrar anuncios. También cobra suscripciones y ofrece capacidad de nube a empresas.", "Separa publicidad y nube. Busca qué segmento aporta cada incremento de ingresos."],
  NVDA: ["Vende procesadores, sistemas de cómputo y productos de red. Entre sus clientes hay fabricantes de equipos y operadores de centros de datos.", "Compara ventas de centros de datos con otros segmentos y revisa el peso de sus clientes grandes."],
  AMZN: ["Cobra por ventas propias, servicios a vendedores, publicidad, suscripciones y uso de AWS.", "Separa el comercio de AWS. Compara el peso de cada segmento en ventas y beneficio operativo."],
  NU: ["Obtiene ingresos del crédito y de servicios financieros. Los depósitos aportan financiación.", "Compara ingresos por crédito con el costo de financiarlo y las pérdidas por impago."],
  JPM: ["Cobra intereses y comisiones de servicios bancarios y de inversión.", "Distingue el margen por intereses de las comisiones y revisa las pérdidas crediticias."],
  XOM: ["Genera ingresos al producir y vender petróleo, gas, combustibles y productos químicos.", "Contrasta cuánto cambia el resultado de cada segmento con los precios y los márgenes de refinación."],
  LLY: ["Los ingresos proceden de ventas de medicamentos a través de sus canales de distribución.", "Busca la concentración de ventas por producto y el gasto necesario para desarrollar nuevos tratamientos."],
  WMT: ["Las ventas minoristas son el centro del negocio. También cobra membresías y vende publicidad.", "Distingue el crecimiento de ventas de los cambios en el margen del comercio."],
  SPY: ["Es un fondo cotizado que busca replicar el S&P 500. Su unidad representa una participación en la cartera del fondo.", "Revisa los gastos, las principales posiciones y la diferencia entre el precio de mercado y el valor liquidativo."],
};

export function TickerStory({ ticker, name, sector, profile, filings }: {
  ticker: string; name: string; sector?: string; profile?: CatalogItem; filings: Filing[];
}) {
  const model = models[ticker];
  const illustration = ticker === "TTD" ? tradeDeskArt : undefined;
  const primary = ticker === "TTD" ? tradeDeskFiling : filings.find(({ form }) => ["10-K", "20-F", "40-F"].includes(form)) ?? filings[0];
  const parts = [
    profile?.summary ?? (sector ? `EDGAR clasifica a este emisor en «${sector}». Abre sus documentos para identificar los productos y servicios.` : "Identifica sus productos y servicios en los documentos del emisor."),
    model?.[0] ?? "Busca en los estados financieros quién paga y qué compra. Anota qué ingreso pertenece a cada línea de negocio.",
    model?.[1] ?? "Compara dos periodos y revisa qué costes, clientes o segmentos pueden explicar los cambios. Formúlalo como una pregunta hasta comprobarlo.",
    primary ? `Consulta el documento ${primary.form} publicado el ${primary.date} y contrasta el periodo, la moneda y las fuentes.`
      : ticker === "SPY" ? "Comprueba en la ficha oficial del fondo su objetivo, sus gastos y la composición del índice." : "Busca el informe anual y lee las notas por segmento. Comprueba la bolsa y el nombre del emisor.",
  ];
  return <section className="ticker-story" aria-label={illustration ? `Arkez Visual Stories: ${name}` : `Ficha educativa: ${name}`}>
    <p className="ve-kicker">{illustration ? "Arkez Visual Stories" : "Ficha educativa"} · {ticker}</p>
    <h3>{illustration ? `${name} en cuatro viñetas` : name}</h3>
    {!model && <p>Guía de lectura para este símbolo. La información pública disponible determina el detalle de la ficha.</p>}
    <ol>{parts.map((part, index) => <li key={chapters[index]} data-panel={index + 1}>
      {illustration && <div className="ticker-story-art"><img src={illustration.src} width={illustration.width} height={illustration.height} alt="" loading="lazy" decoding="async" /></div>}
      <div><h4>{chapters[index]}</h4><p>{part}</p></div>
    </li>)}</ol>
    {primary && <a href={primary.href} target="_blank" rel="noopener noreferrer">Consultar el documento en EDGAR <ArrowUpRight size={15} aria-hidden="true" /></a>}
    {ticker === "NU" && <a href={base + "/explore/nubank/modelo/"}>Leer el modelo de Nubank <ArrowUpRight size={15} aria-hidden="true" /></a>}
    {ticker === "SPY" && <a href="https://www.ssga.com/us/en/intermediary/etfs/spdr-sp-500-etf-trust-spy" target="_blank" rel="noopener noreferrer">Consultar la ficha del fondo <ArrowUpRight size={15} aria-hidden="true" /></a>}
  </section>;
}
