"use client";

import { useEffect, useId, useState } from "react";
import { ChainMark, InsightMark, TokenMark } from "@/components/arkez-icons";
import { AllocationBand, MarketTrace } from "@/components/charts/financial-graphics";
import { defiPaths, financeSeries, hybridAssets } from "@/lib/innovation-modules";

const examples = {
  portafolios: [
    "Si tienes acciones de una empresa y un ETF que también las incluye, suma ambas exposiciones para medir cuánto depende de ella el portafolio.",
    "Dos ETF pueden tener nombres distintos y concentrarse en las mismas empresas. Compara sus principales participaciones antes de contar cada fondo como una exposición separada.",
    "Si las tasas suben, el precio de un bono existente puede caer. Compara cuánto falta para el vencimiento y qué ocurriría si tuvieras que vender antes.",
    "Un activo puede mostrar un saldo en pantalla y tener poca liquidez. Distingue el último precio publicado del efectivo disponible en una venta.",
    "Un token vinculado a un inmueble podría representar participación, deuda o un derecho de cobro. El contrato aclara qué recibe su titular.",
  ],
  defi: [
    "Ejemplo ficticio. La pantalla cotiza 100 unidades, pero solo entrega 97. La diferencia de 3 unidades equivale a un 3 % de deslizamiento.",
    "Ejemplo ficticio. Una garantía de USD 150 respalda una deuda de USD 100. Si cae a USD 110, la relación baja de 150 % a 110 %. Compárala con el umbral hipotético del ejercicio.",
    "Ejemplo ficticio. Un activo tarda siete días en desbloquearse. Si necesitas disponer de él mañana, el plazo importa aunque el saldo siga visible.",
  ],
} as const;

const controls = {
  portafolios: { label: "Examina una exposición", options: hybridAssets, Mark: TokenMark },
  defi: { label: "Sigue una operación", options: defiPaths, Mark: ChainMark },
  ia: { label: "Filtra la fuente de datos", options: financeSeries, Mark: InsightMark },
} as const;

export function InstrumentControl({ kind }: { kind: keyof typeof controls }) {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const id = useId();
  const { label, options, Mark } = controls[kind];
  return (
    <>
      <label className="instrument-control" htmlFor={id}><span><Mark size={20} />{label}</span>
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
      <div className="instrument-note" role="status">
        <strong>{options[index].name}</strong>
        <p>{options[index].note}</p>
        {kind !== "ia" && <p>{examples[kind][index]}</p>}
      </div>
    </>
  );
}
