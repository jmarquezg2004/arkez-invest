import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateCompound, frequencies } from "../lib/compound-interest.ts";

const base = { principal: 1000, monthly: 100, years: 2, annualRate: 12, compounds: 12 };

function approximate(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-8, `Esperado ${expected}, recibido ${actual}`);
}

test("la calculadora suma aportes al final del mes y aplica capitalización mensual", () => {
  const result = calculateCompound(base);
  const expected = 1000 * 1.01 ** 24 + 100 * ((1.01 ** 24 - 1) / .01);
  approximate(result.final.balance, expected);
  approximate(result.final.growth, expected - 3400);
  assert.equal(result.final.contributed, 3400);
  assert.deepEqual(result.rows.map(({ year }) => year), [0, 1, 2]);
  approximate(result.rows[1].balance, 1000 * 1.01 ** 12 + 100 * ((1.01 ** 12 - 1) / .01));
});

test("las cinco frecuencias reproducen su tasa efectiva incluso con aportes mensuales", () => {
  for (const { value } of frequencies) {
    const annualFactor = (1 + .12 / value) ** value;
    const expected = 1000 * annualFactor + 100 * ((annualFactor - 1) / (annualFactor ** (1 / 12) - 1));
    const { final } = calculateCompound({ ...base, years: 1, compounds: value });
    approximate(final.balance, expected);
  }
});

test("tasa cero, tasas negativas y extremos válidos producen resultados coherentes", () => {
  assert.deepEqual(calculateCompound({ ...base, annualRate: 0 }).final,
    { year: 2, contributed: 3400, balance: 3400, growth: 0 });
  approximate(calculateCompound({ ...base, monthly: 0, annualRate: -20, compounds: 1 }).final.balance, 640);
  assert.equal(calculateCompound({ ...base, monthly: 0, principal: 0 }).final.balance, 0);
  assert.ok(Number.isFinite(calculateCompound({ ...base, principal: 1e12, years: 50, annualRate: 100, compounds: 365 }).final.balance));
  for (const invalid of [{ annualRate: -100 }, { years: 2.5 }, { compounds: 52 }, { monthly: -1 }, { principal: Infinity }]) {
    assert.throws(() => calculateCompound({ ...base, ...invalid }), RangeError);
  }
});
