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

test("mantiene un flujo negativo si los gastos superan los ingresos y la inflación es cero", () => {
  const result = evaluateProperty({ price: 100, expense: 3, income: 1, appreciation: 0, inflation: 0, years: 20 });
  assert.equal(result.length, 21);
  assert.deepEqual(result[20], { nominal: 100, real: 100, discountedCashFlow: -480, realChange: -480 });
});

test("con ingresos nulos y un horizonte de un año no confunde nominal con real", () => {
  const [, final] = evaluateProperty({ price: 100, expense: 0, income: 0, appreciation: -8, inflation: 15, years: 1 });
  assert.equal(final.nominal, 92);
  assert.equal(final.discountedCashFlow, 0);
  assert.ok(Math.abs(final.real - 80) < 1e-9);
  assert.ok(Math.abs(final.realChange + 20) < 1e-9);
});

test("en el horizonte máximo ajusta el valor y cada flujo por su propio año", () => {
  const result = evaluateProperty({ price: 900, expense: 0, income: 8, appreciation: 15, inflation: 14, years: 20 });
  const final = result.at(-1);
  const expectedFlow = Array.from({ length: 20 }, (_, index) => 96 / 1.14 ** (index + 1)).reduce((sum, flow) => sum + flow, 0);
  assert.ok(Math.abs(final.real - 900 * (1.15 / 1.14) ** 20) < 1e-8);
  assert.ok(Math.abs(final.discountedCashFlow - expectedFlow) < 1e-8);
  assert.ok(Math.abs(final.realChange - (final.real + expectedFlow - 900)) < 1e-8);
});
