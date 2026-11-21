export const frequencies = [
  { value: 1, label: "Anual" },
  { value: 2, label: "Semestral" },
  { value: 4, label: "Trimestral" },
  { value: 12, label: "Mensual" },
  { value: 365, label: "Diaria" },
] as const;

export type CompoundScenario = {
  principal: number;
  monthly: number;
  years: number;
  annualRate: number;
  compounds: number;
};

export function validateScenario({ principal, monthly, years, annualRate, compounds }: CompoundScenario) {
  if (!Number.isFinite(principal) || principal < 0 || principal > 1e12
    || !Number.isFinite(monthly) || monthly < 0 || monthly > 1e12) return "Ingresa montos entre 0 y 1 billón (1.000.000.000.000).";
  if (!Number.isInteger(years) || years < 1 || years > 50) return "El plazo debe ser un número entero de 1 a 50 años.";
  if (!Number.isFinite(annualRate) || annualRate < -99 || annualRate > 100) return "Ingresa una tasa anual entre −99 % y 100 %.";
  if (!frequencies.some(({ value }) => value === compounds)) return "Selecciona una frecuencia de capitalización.";
  return "";
}

export function calculateCompound(scenario: CompoundScenario) {
  const issue = validateScenario(scenario);
  if (issue) throw new RangeError(issue);
  const { principal, monthly, years, annualRate, compounds } = scenario;
  // Convert a nominal annual rate to a monthly rate with the same annual growth factor.
  const monthlyRate = Math.expm1(Math.log1p(annualRate / 100 / compounds) * compounds / 12);
  let balance = principal;
  const rows = [{ year: 0, contributed: principal, balance, growth: 0 }];

  for (let month = 1; month <= years * 12; month++) {
    balance += balance * monthlyRate + monthly;
    if (month % 12 === 0) {
      const contributed = principal + monthly * month;
      rows.push({ year: month / 12, contributed, balance, growth: balance - contributed });
    }
  }

  return { rows, final: rows[rows.length - 1] };
}
