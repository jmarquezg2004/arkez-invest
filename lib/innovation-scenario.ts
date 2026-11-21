export function comparePortfolios(digitalWeight: number, digitalChange: number) {
  const diversified = { equity: 50, bonds: 50 - digitalWeight, digital: digitalWeight };
  const reference = { equity: 50, bonds: 50, digital: 0 };
  const equityChange = -8;
  const bondChange = 1;
  const contributions = {
    equity: diversified.equity * equityChange / 100,
    bonds: diversified.bonds * bondChange / 100,
    digital: diversified.digital * digitalChange / 100,
  };
  const outcome = (weights: typeof diversified) =>
    (weights.equity * equityChange + weights.bonds * bondChange + weights.digital * digitalChange) / 100;

  return { diversified, reference, contributions, diversifiedChange: outcome(diversified), referenceChange: outcome(reference) };
}
