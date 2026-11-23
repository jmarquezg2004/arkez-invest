import assert from "node:assert/strict";
import test from "node:test";
import { evaluateProperty } from "../app/prototipos/arkez-nexacore/property.ts";

test("el evaluador separa valorización, inflación y flujo neto anual", () => {
  const inputs = { price: 100, expense: 1, income: 2, appreciation: 10, inflation: 10, years: 2 };
  const [initial, yearOne, yearTwo] = evaluateProperty(inputs);
  const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} ≠ ${expected}`);
  assert.deepEqual(initial, { nominal: 100, real: 100, discountedCashFlow: 0, realChange: 0 });
  close(yearOne.real, 100);
  close(yearTwo.nominal, 121);
  close(yearTwo.discountedCashFlow, 12 / 1.1 + 12 / 1.21);
  close(yearTwo.realChange, yearTwo.discountedCashFlow);
  close(evaluateProperty(inputs, 0)[2].real, 100 / 1.21);
});

test("sin alquiler, una caída de valor y los gastos reducen el resultado", () => {
  const [, yearOne] = evaluateProperty({ price: 100, expense: 1, income: 0, appreciation: -5, inflation: 0, years: 1 });
  assert.deepEqual(yearOne, { nominal: 95, real: 95, discountedCashFlow: -12, realChange: -17 });
});
