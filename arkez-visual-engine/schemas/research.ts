export const resourceTypes = [
  { id: "informe", title: "Informe empresarial", detail: "Resultados, fortalezas y riesgos", art: "report" },
  { id: "ficha", title: "Ficha empresarial", detail: "Identidad y cifras esenciales", art: "bank" },
  { id: "graficos", title: "Gráficos financieros", detail: "Evolución y comparativas", art: "study" },
  { id: "mapa", title: "Presencia regional", detail: "Brasil, México y Colombia", art: "globe" },
  { id: "modelo", title: "Modelo de negocio", detail: "Cómo se relacionan sus actividades", art: "chain" },
  { id: "estudio", title: "Estudio completo", detail: "Actividad guiada y respuestas", art: "study" },
] as const;
export type ResourceId = (typeof resourceTypes)[number]["id"];

export type Source = {
  title: string;
  href: string;
  published: string;
  // Issuer releases do not always disclose the publication time.
  time?: string;
};

export type Research = {
  slug: string;
  name: string;
  legalName: string;
  ticker: string;
  exchange: string;
  summary: string;
  period: string;
  source: Source;
  accounts: Source;
  financials: { year: string; revenue: number; gross: number; net: number; eps: number }[];
  indicators: { label: string; value: string; detail: string }[];
  markets: { name: string; capital: string; detail: string }[];
  model: { title: string; detail: string }[];
  strengths: string[];
  risks: string[];
  conclusion: string;
};
