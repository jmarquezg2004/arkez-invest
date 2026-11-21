"use client";

import { useState } from "react";
import { AllocationPlot, type Allocation } from "./allocation-plot";
import { percent } from "./financial-format";

export function AllocationBand({ assets, label }: { assets: readonly Allocation[]; label: string }) {
  const [selected, setSelected] = useState<Allocation["tone"] | null>(null);
  const focused = assets.find(({ tone }) => tone === selected);

  return <div className="allocation-band">
    <AllocationPlot assets={assets} selected={selected} />
    <ul role="list" aria-label={label}>
      {assets.map(({ name, weight, tone }) => <li key={name} data-tone={tone}>
        <button className="allocation-key" type="button" aria-pressed={tone === selected}
          onClick={() => setSelected(tone === selected ? null : tone)}>
          {name} <strong>{percent(weight)}</strong>
        </button>
      </li>)}
    </ul>
    <p className="allocation-detail" role="status">{focused
      ? <>{focused.name} representa <strong>{percent(focused.weight)}</strong> del total.</>
      : "Selecciona un activo para destacar su peso."}</p>
  </div>;
}
