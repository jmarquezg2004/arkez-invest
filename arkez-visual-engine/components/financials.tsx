"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";
import type { Research } from "../schemas/research";

const options = [["revenue", "Ingresos"], ["gross", "Beneficio bruto"], ["net", "Beneficio neto"], ["eps", "Beneficio por acción"]] as const;
const amount = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });
const perShare = new Intl.NumberFormat("es-CO", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
export function Financials({ data, company }: { data: Research["financials"]; company: string }) {
  const [metric, setMetric] = useState<(typeof options)[number][0]>("revenue");
  const eps = metric === "eps";
  const number = eps ? perShare : amount;
  const unit = eps ? "US$ por acción" : "US$ millones";
  const [width, setWidth] = useState(0);
  const [status, setStatus] = useState("");
  const plot = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!plot.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(plot.current);
    return () => observer.disconnect();
  }, []);
  async function save(format: "svg" | "png") {
    const source = plot.current?.querySelector("svg.recharts-surface");
    if (!source) return;
    const clone = source.cloneNode(true) as SVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const markup = new XMLSerializer().serializeToString(clone);
    const input = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(input);
    function trigger(href: string) {
      const link = document.createElement("a");
      link.href = href;
      link.download = `arkez-${company}-${metric}.${format}`;
      link.click();
    }
    if (format === "svg") { trigger(url); setTimeout(() => URL.revokeObjectURL(url), 1000); return; }
    const image = new Image();
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
    try {
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width * 2; canvas.height = image.height * 2;
      const context = canvas.getContext("2d");
      if (!context) { setStatus("El navegador no pudo preparar la imagen PNG."); return; }
      context.fillStyle = "#ffffff"; context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      trigger(canvas.toDataURL("image/png"));
    } catch { setStatus("No se pudo exportar el PNG. Puedes descargar el SVG."); }
    finally { URL.revokeObjectURL(url); }
  }
  return <section className="ve-stats">
    <h2>Evolución financiera</h2><p>Ejercicios 2023 y 2024 · {unit}{eps ? " · EPS básico" : ""}.</p>
    <div className="ve-segment" role="group" aria-label="Indicador financiero">{options.map(([id, label]) => <button type="button" key={id} onClick={() => setMetric(id)} aria-pressed={metric === id}>{label}</button>)}</div>
    <div className="ve-chart" ref={plot}>{width > 100 && <BarChart width={width} height={240} data={data} margin={{ top: 10, left: 5, right: 10, bottom: 4 }}>
      <CartesianGrid vertical={false} stroke="#dce1ed" strokeDasharray="4 4" />
      <XAxis dataKey="year" tickLine={false} tick={{ fill: "#35465d" }} />
      <YAxis tickLine={false} axisLine={false} width={53} tick={{ fill: "#35465d", fontSize: 11 }} tickFormatter={(value: number) => number.format(value)} />
      <Tooltip formatter={(value) => value == null ? "" : `US$ ${number.format(Number(value))}${eps ? " por acción" : " M"}`} />
      <Bar dataKey={metric} name={options.find(([id]) => id === metric)?.[1]} fill="#7943bd" radius={[7, 7, 0, 0]} maxBarSize={110} isAnimationActive={!reduced} animationDuration={340} />
    </BarChart>}</div>
    <table><caption>Valores para {options.find(([id]) => id === metric)?.[1].toLowerCase()}</caption><thead><tr><th scope="col">Ejercicio</th><th scope="col">{unit}</th></tr></thead><tbody>{data.map((row) => <tr key={row.year}><th scope="row">{row.year}</th><td>{number.format(row[metric])}</td></tr>)}</tbody></table>
    <section className="ve-export" aria-label="Exportar"><button type="button" onClick={() => void save("svg")}><Download size={17} /> SVG del gráfico</button><button type="button" onClick={() => void save("png")}><Download size={17} /> PNG del gráfico</button><span role="status">{status}</span></section>
  </section>;
}
