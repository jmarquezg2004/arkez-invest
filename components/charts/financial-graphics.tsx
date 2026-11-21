import { esNumber } from "./financial-format";

export { esNumber, percent } from "./financial-format";
export { AllocationBand } from "./allocation-band";
export type { Allocation } from "./allocation-plot";

export function MarketTrace({ readings, baseline = 100, markers = false }: {
  readings: readonly number[]; baseline?: number; markers?: boolean;
}) {
  const y = (value: number) => 88 - (value - baseline) * 2.55;
  const labels = [baseline + 25, baseline, baseline - 25];
  const start = 38;
  const end = 395;
  const x = (index: number) => start + index * (end - start) / Math.max(1, readings.length - 1);
  const line = readings.map((value, index) => {
    if (index === 0) return `M${x(index)} ${y(value)}`;
    const previous = x(index - 1);
    const next = x(index);
    const middle = previous + (next - previous) / 2;
    // Horizontal control tangents keep the curve between each pair of readings.
    return `C${middle} ${y(readings[index - 1])} ${middle} ${y(value)} ${next} ${y(value)}`;
  }).join(" ");
  const close = readings.at(-1) ?? baseline;
  return <svg className="market-trace" viewBox="0 0 420 170" role={markers ? "group" : undefined} aria-label={markers ? "Índice ficticio en puntos" : undefined} aria-hidden={markers ? undefined : true}>
    {labels.map((label) => <g key={label}>
      <path className="chart-grid" d={`M${start} ${y(label)}H${end}`}/>
      <text className="trace-axis" x="29" y={y(label) + 4} textAnchor="end">{esNumber.format(label)}</text>
    </g>)}
    <path className="trace-fill" d={`${line} V152 H${start} Z`} />
    <path className="trace-baseline" d={`M${start} 88H${end}`} />
    <path className="trace-line" pathLength="1" d={line} />
    {markers && readings.map((value, index) => {
      const point = x(index);
      const level = y(value);
      const left = Math.min(300, Math.max(37, point - 52));
      const top = level < 63 ? level + 14 : level - 53;
      return <g key={index} className="trace-point" tabIndex={0} role="img" aria-label={`Observación ${index + 1}: ${esNumber.format(value)} puntos`}>
        <circle cx={point} cy={level} r="15" className="trace-hit"/>
        <circle cx={point} cy={level} r="8" className="trace-halo"/>
        <circle className="trace-marker" cx={point} cy={level} r="3.5" />
        <g className="trace-tooltip" aria-hidden="true">
          <rect x={left} y={top} width="105" height="41" rx="5" />
          <text className="trace-tooltip-caption" x={left + 9} y={top + 14}>Observación {index + 1}</text>
          <text x={left + 9} y={top + 30}>{esNumber.format(value)} puntos</text>
        </g>
      </g>;
    })}
    {!markers && <circle className="trace-close" cx={end} cy={y(close)} r="4.5" />}
    <text className="trace-axis" x={start} y="166">Inicio</text>
    <text className="trace-axis" x={end} y="166" textAnchor="end">Cierre</text>
  </svg>;
}
