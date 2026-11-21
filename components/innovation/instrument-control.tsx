"use client";

import { useEffect, useId, useState } from "react";
import { AllocationBand, MarketTrace } from "@/components/charts/financial-graphics";
import { defiPaths, financeSeries, hybridAssets } from "@/lib/innovation-modules";

const controls = {
  portafolios: { label: "Examina una exposición", options: hybridAssets },
  defi: { label: "Sigue una operación", options: defiPaths },
  ia: { label: "Filtra la fuente de datos", options: financeSeries },
} as const;

export function InstrumentControl({ kind }: { kind: keyof typeof controls }) {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const id = useId();
  const { label, options } = controls[kind];
  return (
    <>
      <label className="instrument-control" htmlFor={id}><span>{label}</span>
        <select id={id} disabled={!ready} value={index} onChange={(event) => setIndex(Number(event.currentTarget.value))}>
          {options.map(({ name }, index) => <option value={index} key={name}>{name}</option>)}
        </select>
      </label>
      {kind === "portafolios" && <AllocationBand label="Exposición por instrumento, ejemplo ficticio" assets={hybridAssets} />}
      {kind === "defi" && (
        <>
          <ol className="protocol-flow" role="list" key={defiPaths[index].name}>
            <li>Wallet</li><li>Contrato del protocolo</li><li>{defiPaths[index].destination}</li>
          </ol>
          <p className="instrument-sequence">Cada interacción depende del código del contrato y de sus reglas de salida.</p>
        </>
      )}
      {kind === "ia" && (
        <div className="instrument-signal" key={financeSeries[index].name}>
          <MarketTrace readings={financeSeries[index].readings} markers />
          <p>Datos → análisis → patrón → escenario → decisión humana</p>
        </div>
      )}
      <p className="instrument-note" role="status">{options[index].note}</p>
    </>
  );
}
