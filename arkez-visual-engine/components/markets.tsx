"use client";

import { useState } from "react";
import { Globe2, MapPin } from "lucide-react";
import { ArtImage } from "./art";
import type { Research } from "../schemas/research";

export function Markets({ markets }: { markets: Research["markets"] }) {
  const [active, setActive] = useState(0);
  const market = markets[active];
  return <section className="ve-document-section">
    <h2>Presencia regional</h2>
    <div className="ve-markets"><ArtImage art="globe" /><div className="ve-market-content">
      <div className="ve-segment" role="group" aria-label="Mercados">{markets.map(({ name, capital }, index) => <button type="button" aria-pressed={active === index} key={capital} onClick={() => setActive(index)}><MapPin size={16} />{name}</button>)}</div>
      <div aria-live="polite"><Globe2 size={22} /><h3>{market.name}</h3><p>{market.detail}</p></div>
    </div></div>
  </section>;
}
