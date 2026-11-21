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
  const y = (value: number) => 96 - (value - baseline) * 2.6;
  const x = (index: number) => 25 + index * 360 / (readings.length - 1);
  const line = readings.map((value, index) => `${x(index)} ${y(value)}`).join(" L");
  const close = readings.at(-1) ?? baseline;
  return <svg className="market-trace" viewBox="0 0 410 170" aria-hidden="true">
    <path className="chart-grid" d="M25 31H385 M25 63H385 M25 96H385 M25 129H385 M25 159H385 M25 16V159 M115 16V159 M205 16V159 M295 16V159 M385 16V159" />
    <path className="trace-fill" d={`M${line} V159 H25 Z`} />
    <path className="trace-baseline" d="M25 96H385" />
    <path className="trace-line" pathLength="1" d={`M${line}`} />
    {markers && readings.map((value, index) => <circle key={index} className="trace-marker" cx={x(index)} cy={y(value)} r="3" />)}
    <circle className="trace-close" cx="385" cy={y(close)} r="5.5" />
  </svg>;
}
