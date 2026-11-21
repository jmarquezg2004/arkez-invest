export type Allocation = { name: string; weight: number; tone: "blue" | "steel" | "gold" | "green" | "violet" };

export function AllocationPlot({ assets, selected }: { assets: readonly Allocation[]; selected?: Allocation["tone"] | null }) {
  let offset = 0;

  return (
    <svg className="allocation-plot" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
      {assets.map(({ name, weight, tone }) => {
        const start = offset;
        offset += weight;
        return <rect key={name} x={start} width={weight} height="12" data-tone={tone}
          data-emphasis={selected ? (selected === tone ? "selected" : "muted") : undefined} />;
      })}
    </svg>
  );
}
