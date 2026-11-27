"use client";

import { useState } from "react";
import { useLanguage } from "../language";

const phaseColors = ["#96baff", "#67e1bf", "#f0c879", "#ff969d"];
const knots = [68, 61, 56, 55, 58, 57, 59, 73, 79, 94, 108, 121, 115, 124, 116, 119, 107, 89, 75, 65, 56];
const weeks = Array.from({ length: 100 }, (_, index) => {
  const step = index / 5;
  const start = Math.floor(step);
  return Math.round(knots[start] + (knots[start + 1] - knots[start]) * (step - start)
    + 2.1 * Math.sin(index * 1.23) + 1.1 * Math.cos(index * .52));
});
const history = [...Array.from({ length: 29 }, (_, i) => 104 - i * 1.2), ...weeks];
const series = weeks.map((close, index) => {
  const open = (weeks[index - 1] ?? close + 2) + Math.sin(index * .92) * 2;
  return {
    close, open, low: Math.min(open, close) - 1.8 - index % 3, high: Math.max(open, close) + 1.6 + index % 3,
    volume: 7 + index % 5 * 2 + (index * 19 % 11) + ([25, 26, 75, 77].includes(index) ? 21 : 0),
    average: history.slice(index, index + 30).reduce((sum, value) => sum + value, 0) / 30,
  };
});
const x = (index: number) => 31 + (index + .5) * 8.6;
const y = (value: number) => 26 + (135 - value) * 3.05;
const copy = {
  es: { sample: "Serie simulada · frecuencia semanal", price: "Velas OHLC", average: "Media móvil de 30 semanas", volume: "Volumen relativo", week: "Semana", all: "Ciclo completo", names: ["Base", "Avance", "Techo", "Descenso"], notes: ["El precio se estabiliza y la media pierde pendiente.", "El precio supera el rango y la media empieza a subir.", "La subida pierde impulso y el precio vuelve a un rango.", "El precio pierde el rango y la media gira a la baja."] },
  en: { sample: "Simulated data · weekly interval", price: "OHLC candles", average: "30-week moving average", volume: "Relative volume", week: "Week", all: "Full cycle", names: ["Base", "Advance", "Top", "Decline"], notes: ["Price stabilizes and the average starts to flatten.", "Price clears the range and the average begins to rise.", "The advance loses momentum and price returns to a range.", "Price falls below its range and the average turns lower."] },
};

export function WeinsteinChart() {
  const { locale } = useLanguage();
  const labels = copy[locale];
  const [selected, setSelected] = useState<number | null>(null);

  return <div className="avs-stage-board" data-arkez-localized>
    <div className="avs-stage-head">
      <strong>{labels.sample}</strong>
      <span><i />{labels.price}</span><span><i />{labels.average}</span>
    </div>
    <div className="avs-stage-scroll" tabIndex={0} role="region" aria-label={labels.sample}>
      <svg viewBox="0 0 956 382" role="img" aria-label={labels.names.join(" · ")} className="avs-stage-chart">
        <defs><linearGradient id="weinstein-background" x2="0%" y2="100%"><stop stopColor="#142a45"/><stop offset="1" stopColor="#0c192b"/></linearGradient></defs>
        <rect width="956" height="382" fill="url(#weinstein-background)" />
        {phaseColors.map((fill, index) => <g key={fill}>
          <rect x={31 + index * 215} y="26" width="215" height="325" fill={fill} opacity={selected === index ? .18 : .042} />
          <line x1={31 + index * 215} x2={31 + index * 215} y1="26" y2="351" stroke={fill} opacity=".4" strokeDasharray="3 5" />
          <text x={42 + index * 215} y="18" fill={fill} fontSize="12" fontWeight="700">{index + 1} · {labels.names[index]}</text>
        </g>)}
        {[60, 80, 100, 120].map((value) => <g key={value}>
          <line x1="31" x2="892" y1={y(value)} y2={y(value)} stroke="#597089" strokeOpacity=".55" />
          <text x="905" y={y(value) + 4} fill="#dae7f7" fontSize="12">{value}</text>
        </g>)}
        <text x="905" y="18" fontSize="12" fill="#a8bad2">USD</text>
        {series.map(({ close, open, low, high, volume }, i) => <g key={i} opacity={selected === null || Math.floor(i / 25) === selected ? 1 : .3} fill={close >= open ? "#61ddbe" : "#f38692"}>
          <line x1={x(i)} x2={x(i)} y1={y(high)} y2={y(low)} stroke="currentColor" color={close >= open ? "#61ddbe" : "#f38692"} />
          <rect x={x(i) - 2.6} y={y(Math.max(close, open))} width="5.2" height={Math.max(1.15, Math.abs(y(close) - y(open)))} />
          <rect x={x(i) - 2.6} y={350 - volume} width="5.2" height={volume} opacity=".6" />
        </g>)}
        <polyline points={series.map(({ average }, i) => `${x(i)},${y(average)}`).join(" ")} stroke="#f6c878" strokeWidth="2.6" strokeLinejoin="round" fill="none" />
        <line x1="31" x2="891" y1="288" y2="288" stroke="#597089" />
        <text x="40" y="304" fill="#cad9ee" fontSize="12">{labels.volume}</text>
        {[0, 24, 49, 74, 99].map((i) => <text key={i} x={x(i)} y="372" fill="#b7c7db" textAnchor={i === 0 ? "start" : i === 99 ? "end" : "middle"} fontSize="12">{labels.week} {i + 1}</text>)}
      </svg>
    </div>
    <div className="avs-stage-buttons">
      <button type="button" onClick={() => setSelected(null)} aria-pressed={selected === null}>{labels.all}</button>
      {labels.names.map((name, i) => <button key={name} type="button" onClick={() => setSelected(i)} aria-pressed={selected === i}>{i + 1} · {name}</button>)}
    </div>
    <p className="avs-stage-note" aria-live="polite">{selected === null ? labels.notes.join(" ") : labels.notes[selected]}</p>
  </div>;
}
