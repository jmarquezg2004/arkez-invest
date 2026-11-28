import { useId } from "react";
import { ArrowUpRight, Check, Lightbulb } from "lucide-react";
import type { StaticImageData } from "next/image";
import { companyStoryFor, type CompanyStoryData } from "./company-stories";
import odd from "./odd-company-story.webp";
import ttd from "./ttd-company-story.webp";
import kss from "./kss-story.webp";
import nu from "./nu-story.webp";
import aapl from "./aapl-story.webp";
import spy from "./spy-story.webp";
import tgls from "./tgls-story.webp";
import directoryArt from "./issuer-directory-story.webp";

const artwork: Record<string, StaticImageData> = {
  "NYSE:TGLS": tgls, "NASDAQ:ODD": odd, "NASDAQ:TTD": ttd, "NYSE:KSS": kss, "NYSE:NU": nu, "NASDAQ:AAPL": aapl, "AMEX:SPY": spy,
};

export type GeneratedCompanyStory = CompanyStoryData & { image: string };
type PublicCompany = { name: string; exchange?: string; sector?: string; edgar?: string; ticker: string; filings: { form: string; date: string; href: string }[] };

export function CompanyStory({ symbol, locale, generated, issuer, loading }: {
  symbol: string; locale: "es" | "en";
  generated?: GeneratedCompanyStory | null; issuer?: PublicCompany; loading?: boolean;
}) {
  const id = useId();
  const editorial = companyStoryFor(symbol);
  const story = editorial ?? generated ?? (issuer && directoryStory(issuer));
  if (!story) return null;
  const image = artwork[symbol] ?? directoryArt;
  const imageSrc = generated?.image ?? image.src;
  const isDirectory = !editorial && !generated;
  const copy = story[locale];
  return <figure className="avs avs-company-comic" data-panels="4" data-generated-art={generated ? "" : undefined} data-company-story={symbol} aria-labelledby={id} data-arkez-localized>
    <header>
      <div className="avs-company-masthead">
        <img src="/brand/logo.webp" width={340} height={123} alt="Arkez Invest" />
        <span>Visual Stories</span>
      </div>
      {isDirectory && <p className="avs-series" role={loading ? "status" : undefined}>{locale === "es" ? loading ? "Preparando la historia de la empresa…" : "Guía ilustrada del expediente" : loading ? "Preparing the company’s story…" : "Illustrated filing guide"}</p>}
      <h3 id={id}><span>{symbol.split(":")[1]}</span> {copy.title}</h3>
    </header>
    <ol className="avs-panels" aria-label={locale === "es" ? "Historia en cuatro viñetas" : "Four-panel story"}>
      {copy.captions.map((caption, i) => <li key={i} data-panel={i + 1}>
        <div className="avs-art">
          <img src={imageSrc} width={generated ? 1024 : image.width} height={generated ? 1024 : image.height} alt="" loading="lazy" decoding="async" />
          <span className="avs-dialogue">{copy.prompts[i]}</span>
          <span className="avs-panel-number" aria-hidden="true">{i + 1}</span>
        </div>
        <div className="avs-company-caption">
          <p>{caption}</p>
          {i === 3 && <div className="avs-company-watch">
            <strong>{locale === "es" ? "Claves a vigilar" : "What to watch"}</strong>
            <ul role="list">{copy.watch.map((item) => <li key={item}><Check size={14} aria-hidden="true" />{item}</li>)}</ul>
          </div>}
        </div>
      </li>)}
    </ol>
    <figcaption>
      <p><Lightbulb size={24} aria-hidden="true" />{copy.takeaway}</p>
      <a href={story.source} target="_blank" rel="noopener noreferrer">
        {locale === "es" ? "Consultar fuente primaria" : "Read the primary source"} <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </figcaption>
  </figure>;
}

function directoryStory({ name, exchange, sector, edgar, ticker, filings }: PublicCompany): CompanyStoryData {
  const recent = filings[0];
  const listing = exchange ? `${exchange}: ${ticker}` : ticker;
  return {
    source: recent?.href ?? edgar ?? "https://www.sec.gov/edgar/search/",
    es: {
      title: name,
      prompts: ["¿Qué ficha encontré?", "¿Dónde veo qué hace?", "¿Cómo averiguo quién le paga?", "¿Qué vale la pena revisar?"],
      captions: [
        `La SEC registra a ${name} con el símbolo ${listing}.`,
        sector ? `Su clasificación en EDGAR es «${sector}». La descripción del negocio en el informe anual explica qué vende o qué servicios presta.` : `Busca el apartado «Business» del informe de ${name} para ver qué vende y a quién.`,
        recent ? `El documento más reciente que encontramos es el ${recent.form} del ${recent.date}. Revisa las notas de ingresos para saber de dónde viene el dinero.` : "Abre el expediente de la SEC y busca el último informe anual o prospecto. Allí puedes comprobar las fuentes de ingresos o el objetivo del fondo.",
        "En el informe, identifica qué actividad aporta más, qué costos pesan y de qué clientes o mercados depende.",
      ],
      watch: ["Actividad principal", "Ingresos o cartera", "Riesgos del informe"],
      takeaway: `La ficha de ${ticker} te lleva al documento original para entender el negocio o el fondo.`,
    },
    en: {
      title: name,
      prompts: ["Which company did I find?", "Where can I see what it does?", "How can I tell who pays it?", "What should I look for?"],
      captions: [
        `The SEC lists ${name} under ${listing}.`,
        sector ? `EDGAR classifies it as “${sector}”. The annual report’s business section explains what it sells or provides.` : `Find the Business section in ${name}’s report to see what it sells and to whom.`,
        recent ? `The latest filing shown here is the ${recent.form} dated ${recent.date}. Check the revenue notes to see where the money comes from.` : "Open the SEC filing record and look for the latest annual report or prospectus. It can explain revenue sources or a fund’s objective.",
        "Look for the biggest line of business, the largest costs, and any reliance on specific customers or markets.",
      ],
      watch: ["Main activity", "Revenue or holdings", "Risks in the filing"],
      takeaway: `The ${ticker} record takes you to the original filing so you can understand the business or fund.`,
    },
  };
}
