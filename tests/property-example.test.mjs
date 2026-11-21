import assert from "node:assert/strict";
import { test } from "node:test";
import { projectProperty } from "../lib/property-example.ts";

test("el simulador inmobiliario distingue apreciación, gastos y cambio neto", () => {
  const scenario = projectProperty({ price: 300, expenses: .6, annualChange: 4 });
  assert.equal(scenario.years, 5);
  assert.ok(Math.abs(scenario.future - 364.99587072) < 1e-8);
  assert.equal(scenario.operating, 36);
  assert.ok(Math.abs(scenario.difference - 28.99587072) < 1e-8);
});

test("un valor estable y una caída siguen descontando los gastos del periodo", () => {
  assert.deepEqual(projectProperty({ price: 120, expenses: 3, annualChange: 0 }), {
    years: 5, future: 120, operating: 180, difference: -180,
  });
  const falling = projectProperty({ price: 650, expenses: 0, annualChange: -8 });
  assert.ok(falling.future < 650 && falling.future > 0);
  assert.equal(falling.difference, falling.future - 650);
});
