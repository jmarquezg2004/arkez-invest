"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ChartNoAxesCombined, ChevronLeft, ChevronRight } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";

export const number = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 });
export const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", currencyDisplay: "code", maximumFractionDigits: 0 });
const axisNumber = new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 1 });

type Series = { name: string; values: number[] };
const paints = ["#1c644f", "#96622e", "#335a91"];
const strokes = [undefined, "8 4", "2 4"];

export function FinancialChart({ series, periods, title }: { series: readonly Series[]; periods: string[]; title: string }) {
  const gradient = useId();
  const plot = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const reduced = useReducedMotion();
  const active = Math.min(cursor ?? periods.length - 1, periods.length - 1);
  const visible = series.filter(({ name }) => !hidden.includes(name));
  const count = visible.length;
  const display = (value: number) => money.format(value * 1e6);
  const rows = useMemo(() => periods.map((period, index) => ({
    period, ...Object.fromEntries(series.map(({ name, values }) => [name, values[index]])),
  })), [periods, series]);
  useEffect(() => {
    const element = plot.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(0, Math.floor(entry.contentRect.width))));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  function toggle(name: string) {
    if (hidden.includes(name)) setHidden(hidden.filter((item) => item !== name));
    else if (count > 1) setHidden([...hidden, name]);
  }
  function selectPoint(state: { activeTooltipIndex?: number | string | null }) {
    if (state.activeTooltipIndex == null) return;
    const index = Number(state.activeTooltipIndex);
    if (Number.isInteger(index) && index >= 0 && index < periods.length) setCursor(index);
  }

  return <figure className="nx-viz" aria-label={title}>
    <div className="nx-viz-heading"><span><ChartNoAxesCombined size={17} />{title}</span><small>Millones de COP</small></div>
    <div className="nx-viz-inspection" aria-live="off">
      <strong>{periods[active]}</strong>
      <dl>{visible.map(({ name, values }) => <div key={name}><dt>{name}</dt><dd>{display(values[active])}</dd></div>)}</dl>
    </div>
    <div className="nx-viz-plot" ref={plot} aria-hidden="true">
      {width > 100 && <ComposedChart width={width} height={width < 410 ? 205 : 266} data={rows}
        margin={{ left: 1, right: width < 410 ? 12 : 18, bottom: 0, top: 9 }}
        accessibilityLayer={false} onMouseMove={selectPoint} onClick={selectPoint} onTouchMove={(state) => {
          if (state) selectPoint(state);
        }}>
        <defs><linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={paints[0]} stopOpacity={.22} /><stop offset="100%" stopColor={paints[0]} stopOpacity={.015} /></linearGradient></defs>
        <CartesianGrid vertical={false} stroke="#d8ded6" strokeDasharray="3 4" />
        <XAxis dataKey="period" tickLine={false} axisLine={{ stroke: "#c5cdc4" }} minTickGap={width < 410 ? 38 : 20} tick={{ fill: "#47584e", fontSize: 11 }} tickMargin={9} />
        <YAxis tickLine={false} axisLine={false} width={45} tickCount={5} tickFormatter={(value: number) => axisNumber.format(value)} tick={{ fill: "#47584e", fontSize: 11 }}
          domain={[((minimum: number) => Math.min(minimum, 0)), "auto"]} />
        <ReferenceLine x={periods[active]} stroke="#6b7b70" strokeDasharray="4 4" />
        <Tooltip cursor={false} content={() => null} />
        {series.map(({ name, values }, index) => {
          const common = { dataKey: name, stroke: paints[index], strokeWidth: index === 0 ? 2.6 : 2, strokeDasharray: strokes[index],
            isAnimationActive: !reduced, animationDuration: 430, activeDot: false as const,
            dot: (props: { cx?: number; cy?: number; index?: number }) =>
              <circle key={props.index} cx={props.cx} cy={props.cy} r={props.index === active || values.length === 1 ? 4.5 : 0} fill={paints[index]} stroke="#fbfcf7" strokeWidth={1.8} />,
          };
          if (hidden.includes(name)) return null;
          return index === 0
            ? <Area key={name} {...common} fill={`url(#${gradient})`} />
            : <Line key={name} {...common} />;
        })}
      </ComposedChart>}
    </div>
    <div className="nx-viz-navigator" role="group" aria-label={`Seleccionar periodo · ${title}`}>
      <button type="button" aria-label="Periodo anterior" disabled={active === 0} onClick={() => setCursor(active - 1)}><ChevronLeft size={16} /></button>
      <input type="range" aria-label={`Periodo · ${title}`} aria-valuetext={periods[active]} min="0" max={Math.max(0, periods.length - 1)} step="1" disabled={periods.length === 1} value={active} onChange={(event) => setCursor(event.currentTarget.valueAsNumber)} />
      <button type="button" aria-label="Periodo siguiente" disabled={active === periods.length - 1} onClick={() => setCursor(active + 1)}><ChevronRight size={16} /></button>
    </div>
    <div className="nx-viz-legend" role="group" aria-label="Series del gráfico">
      {series.map(({ name }, index) => <button className={`nx-viz-legend-${index}`} type="button" key={name} aria-pressed={!hidden.includes(name)}
        aria-disabled={count === 1 && !hidden.includes(name)} onClick={() => toggle(name)}>{name}</button>)}
    </div>
    <details className="nx-viz-data"><summary>Ver valores por periodo</summary><div tabIndex={0} role="region" aria-label={`Tabla de valores · ${title}`}><table>
      <thead><tr><th scope="col">Periodo</th>{visible.map(({ name }) => <th scope="col" key={name}>{name}</th>)}</tr></thead>
      <tbody>{periods.map((period, index) => <tr key={period}><th scope="row">{period}</th>{visible.map(({ name, values }) => <td key={name}>{display(values[index])}</td>)}</tr>)}</tbody>
    </table></div></details>
  </figure>;
}
