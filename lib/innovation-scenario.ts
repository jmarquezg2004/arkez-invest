export function comparePortfolios(digitalWeight: number, digitalChange: number) {
  const diversified = { equity: 50, bonds: 50 - digitalWeight, digital: digitalWeight };
  const reference = { equity: 50, bonds: 50, digital: 0 };
  const equityChange = -8;
  const bondChange = 1;
  const outcome = (weights: typeof diversified) =>
    (weights.equity * equityChange + weights.bonds * bondChange + weights.digital * digitalChange) / 100;

  return { diversified, reference, diversifiedChange: outcome(diversified), referenceChange: outcome(reference) };
}
