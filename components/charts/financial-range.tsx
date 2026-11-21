import type { ChangeEvent } from "react";

type FinancialRangeProps = {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  valueText: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function FinancialRange({ id, min, max, step, value, valueText, onChange }: FinancialRangeProps) {
  const progress = (value - min) / (max - min) * 100;

  return (
    <div className="financial-range">
      <svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
        <rect width="100" height="8" className="range-track" />
        <rect width={progress} height="8" className="range-progress" />
      </svg>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        aria-valuetext={valueText} onChange={onChange} />
    </div>
  );
}
