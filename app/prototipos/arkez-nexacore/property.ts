export type PropertyInputs = {
  price: number;
  expense: number;
  income: number;
  appreciation: number;
  inflation: number;
  years: number;
};

export function evaluateProperty(inputs: PropertyInputs, appreciation = inputs.appreciation) {
  const inflation = 1 + inputs.inflation / 100;
  const annualCashFlow = (inputs.income - inputs.expense) * 12;
  let discountedCashFlow = 0;
  return Array.from({ length: inputs.years + 1 }, (_, year) => {
    if (year > 0) discountedCashFlow += annualCashFlow / inflation ** year;
    const nominal = inputs.price * (1 + appreciation / 100) ** year;
    const real = nominal / inflation ** year;
    return { nominal, real, discountedCashFlow, realChange: real + discountedCashFlow - inputs.price };
  });
}
