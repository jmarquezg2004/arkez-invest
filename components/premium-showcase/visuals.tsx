import type { PointerEvent, ReactNode } from "react";

export const money = new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", currencyDisplay: "code", maximumFractionDigits: 0,
});
export const decimal = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });
export const compact = new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 1 });

export function FrameLabel({ title, badge = "Datos ficticios" }: { title: string; badge?: string }) {
  return <div className="px-frame-label"><span><i aria-hidden="true" />{title}</span><small>{badge}</small></div>;
}

export function PlotGrid({ labels, children, label, onInspect }: {
  labels: readonly string[]; children: ReactNode; label: string; onInspect?: (progress: number) => void;
}) {
  function inspect(event: PointerEvent<SVGSVGElement>) {
    if (event.pointerType === "touch") return;
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return;
    const { x } = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    onInspect?.(Math.min(1, Math.max(0, (x - 56) / 375)));
  }
  return <svg className="px-plot" aria-label={label} role="img" viewBox="0 0 440 162" onPointerMove={onInspect ? inspect : undefined}>
    {labels.map((text, index) => {
      const y = 16 + (128 * index / Math.max(1, labels.length - 1));
      return <g key={index}><path className="px-gridline" d={`M56 ${y}H431`} /><text x="49" y={y+4} textAnchor="end">{text}</text></g>;
    })}
    {children}
  </svg>;
}

export function sparkPath(values: readonly number[], low: number, high: number) {
  return values.map((val, index) => `${index ? "L" : "M"}${56 + index * 375 / Math.max(1, values.length - 1)} ${144 - (val - low) * 128 / (high - low)}`).join(" ");
}
