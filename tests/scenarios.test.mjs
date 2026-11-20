import assert from "node:assert/strict";
import test from "node:test";
import { evaluateScenario } from "../lib/learning-scenarios.ts";

test("los cuatro ejercicios calculan valores de referencia y extremos", () => {
  assert.equal(evaluateScenario("mercados", -25), 75);
  assert.equal(evaluateScenario("mercados", 25), 125);
  assert.equal(evaluateScenario("diversificacion", 0), 0);
  assert.equal(evaluateScenario("diversificacion", 60), -12);
  assert.equal(evaluateScenario("diversificacion", 100), -20);
  assert.equal(evaluateScenario("riesgo", 0), 0);
  assert.equal(evaluateScenario("riesgo", 15), -150_000);
  assert.equal(evaluateScenario("riesgo", 60), -600_000);
  assert.equal(evaluateScenario("herramientas", 1_200_000), 0);
  assert.equal(evaluateScenario("herramientas", 1_500_000), -300_000);
});
