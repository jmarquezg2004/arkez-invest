export const esNumber = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });
export const percent = (value: number) => `${esNumber.format(value)} %`;

export type Allocation = { name: string; weight: number; tone: "blue" | "steel" | "gold" | "green" | "violet" };

export function AllocationBand({ assets, label }: { assets: readonly Allocation[]; label: string }) {
  let offset = 0;
  return <div className="allocation-band">
    <svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
      {assets.map(({ name, weight, tone }) => {
        const start = offset;
        offset += weight;
        return <rect key={name} x={start} width={weight} height="12" data-tone={tone} />;
      })}
    </svg>
    <ul role="list" aria-label={label}>
      {assets.map(({ name, weight, tone }) => <li key={name} data-tone={tone}>{name} <strong>{percent(weight)}</strong></li>)}
    </ul>
  </div>;
}

export function MarketTrace({ readings, baseline = 100, markers = false }: {
  readings: readonly number[]; baseline?: number; markers?: boolean;
}) {
  const y = (value: number) => 88 - (value - baseline) * 2.55;
  const labels = [baseline + 25, baseline, baseline - 25];
  const start = 38;
  const end = 395;
  const x = (index: number) => start + index * (end - start) / Math.max(1, readings.length - 1);
  const line = readings.map((value, index) => `${x(index)} ${y(value)}`).join(" L");
  const close = readings.at(-1) ?? baseline;
  return <svg className="market-trace" viewBox="0 0 420 170" role={markers ? "group" : undefined} aria-label={markers ? "Índice ficticio en puntos" : undefined} aria-hidden={markers ? undefined : true}>
    {labels.map((label) => <g key={label}>
      <path className="chart-grid" d={`M${start} ${y(label)}H${end}`}/>
      <text className="trace-axis" x="29" y={y(label) + 4} textAnchor="end">{esNumber.format(label)}</text>
    </g>)}
    <path className="trace-fill" d={`M${line} V152 H${start} Z`} />
    <path className="trace-baseline" d={`M${start} 88H${end}`} />
    <path className="trace-line" pathLength="1" d={`M${line}`} />
    {markers && readings.map((value, index) => <g key={index} className="trace-point" tabIndex={0} role="img" aria-label={`Observación ${index + 1}: ${esNumber.format(value)} puntos`}>
      <circle cx={x(index)} cy={y(value)} r="12" className="trace-hit"/>
      <circle className="trace-marker" cx={x(index)} cy={y(value)} r="3.5" />
      <g className="trace-tooltip" aria-hidden="true">
        <rect x={Math.min(350, Math.max(34, x(index) - 24))} y={Math.max(4, y(value) - 29)} width="48" height="21" rx="4" />
        <text x={Math.min(374, Math.max(58, x(index)))} y={Math.max(4, y(value) - 29) + 14} textAnchor="middle">{esNumber.format(value)}</text>
      </g>
    </g>)}
    {!markers && <circle className="trace-close" cx={end} cy={y(close)} r="4.5" />}
    <text className="trace-axis" x={start} y="166">Inicio</text>
    <text className="trace-axis" x={end} y="166" textAnchor="end">Cierre</text>
  </svg>;
}
