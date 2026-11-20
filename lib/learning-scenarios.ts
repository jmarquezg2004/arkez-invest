export const scenarioKeys = ["mercados", "diversificacion", "riesgo", "herramientas"] as const;
export type ScenarioKey = (typeof scenarioKeys)[number];

export function evaluateScenario(key: ScenarioKey, input: number) {
  switch (key) {
    case "mercados": return 100 * (1 + input / 100);
    case "diversificacion": return 0 - 20 * (input / 100);
    case "riesgo": return 0 - 1_000_000 * (input / 100);
    case "herramientas": return 400_000 + 800_000 - input;
  }
}
