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
import bb from "./bb-story.webp";
import spcx from "./spcx-story.webp";

const artwork: Record<string, StaticImageData> = {
  "NYSE:BB": bb, "NASDAQ:SPCX": spcx, "NYSE:TGLS": tgls, "NASDAQ:ODD": odd, "NASDAQ:TTD": ttd, "NYSE:KSS": kss, "NYSE:NU": nu, "NASDAQ:AAPL": aapl, "AMEX:SPY": spy,
};

export type GeneratedCompanyStory = CompanyStoryData & { image?: string };
export function CompanyStory({ symbol, locale, generated }: {
  symbol: string; locale: "es" | "en";
  generated?: GeneratedCompanyStory | null;
}) {
  const id = useId();
  const story = companyStoryFor(symbol) ?? generated;
  if (!story) return null;
  const image = artwork[symbol];
  const imageSrc = image?.src ?? generated?.image;
  const copy = story[locale];
  return <figure className="avs avs-company-comic" data-panels="4" data-generated-art={generated ? "" : undefined} data-company-story={symbol} aria-labelledby={id} data-arkez-localized>
    <header>
      <div className="avs-company-masthead">
        <img src="/brand/logo.webp" width={340} height={123} alt="Arkez Invest" />
        <span>Visual Stories</span>
      </div>
      <h3 id={id}><span>{symbol.split(":").at(-1)}</span> {copy.title}</h3>
    </header>
    <ol className="avs-panels" aria-label={locale === "es" ? "Historia en cuatro viñetas" : "Four-panel story"}>
      {copy.captions.map((caption, i) => <li key={i} data-panel={i + 1}>
        {imageSrc ? <div className="avs-art">
          <img src={imageSrc} width={image?.width ?? 1024} height={image?.height ?? 1024} alt="" loading="lazy" decoding="async" />
          <span className="avs-dialogue">{copy.prompts[i]}</span>
          <span className="avs-panel-number" aria-hidden="true">{i + 1}</span>
        </div> : <strong className="avs-company-caption">{copy.prompts[i]}</strong>}
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
      {story.outlookSource && <a className="avs-outlook-source" href={story.outlookSource} target="_blank" rel="noopener noreferrer">
        {locale === "es" ? "Fuente sobre los planes futuros" : "Source on future plans"} <ArrowUpRight size={15} aria-hidden="true" />
      </a>}
    </figcaption>
  </figure>;
}
