import assert from "node:assert/strict";
import { test } from "node:test";
import { comparePortfolios } from "../lib/innovation-scenario.ts";

test("el simulador conserva 100 % del capital y solo reasigna bonos a activos digitales", () => {
  for (let weight = 0; weight <= 30; weight += 5) {
    const { diversified, reference } = comparePortfolios(weight, -25);
    assert.equal(diversified.equity, reference.equity);
    assert.equal(diversified.bonds, reference.bonds - weight);
    assert.equal(diversified.digital, weight);
    assert.equal(Object.values(diversified).reduce((sum, value) => sum + value, 0), 100);
  }
});

test("las dos carteras coinciden con peso cero y la híbrida reacciona al choque", () => {
  const identical = comparePortfolios(0, -50);
  assert.equal(identical.diversifiedChange, identical.referenceChange);
  assert.equal(identical.referenceChange, -3.5);
  assert.equal(comparePortfolios(15, -25).diversifiedChange, -7.4);
  assert.equal(comparePortfolios(30, -50).diversifiedChange, -18.8);
  assert.equal(comparePortfolios(30, 25).diversifiedChange, 3.7);
});
