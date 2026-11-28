import { useId } from "react";
import { ArrowUpRight } from "lucide-react";
import type { StaticImageData } from "next/image";
import { companyStoryFor } from "./company-stories";
import odd from "./oddity-en-cuatro-vinetas.webp";
import ttd from "./ttd-vinetas.webp";
import kss from "./kss-story.webp";
import nu from "./nu-story.webp";
import aapl from "./aapl-story.webp";
import spy from "./spy-story.webp";

const artwork: Record<string, StaticImageData> = {
  "NASDAQ:ODD": odd, "NASDAQ:TTD": ttd, "NYSE:KSS": kss, "NYSE:NU": nu, "NASDAQ:AAPL": aapl, "AMEX:SPY": spy,
};

export function CompanyStory({ symbol, locale }: { symbol: string; locale: "es" | "en" }) {
  const id = useId();
  const story = companyStoryFor(symbol);
  if (!story) return null;
  const image = artwork[symbol];
  const copy = story[locale];
  return <figure className="avs avs-company-comic" data-panels="4" data-company-story={symbol} aria-labelledby={id} data-arkez-localized>
    <header><div>
      <p className="avs-series">Arkez Visual Stories · {symbol}</p>
      <h3 id={id}>{copy.title}</h3>
    </div></header>
    <ol className="avs-panels" aria-label={locale === "es" ? "Historia en cuatro viñetas" : "Four-panel story"}>
      {copy.captions.map((caption, i) => <li key={i} data-panel={i + 1}>
        <div className="avs-art">
          <img src={image.src} width={image.width} height={image.height} alt="" loading="lazy" decoding="async" />
          <span className="avs-dialogue">{copy.prompts[i]}</span>
          <span className="avs-panel-number" aria-hidden="true">{i + 1}</span>
        </div>
        <p>{caption}</p>
      </li>)}
    </ol>
    <figcaption>
      <p>{copy.takeaway}</p>
      <a href={story.source} target="_blank" rel="noopener noreferrer">
        {locale === "es" ? "Consultar fuente primaria" : "Read the primary source"} <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </figcaption>
  </figure>;
}
