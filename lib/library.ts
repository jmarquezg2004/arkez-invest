export type EditionSlug = "primeros-pasos-para-invertir" | "lectura-de-mercados" | "liquidez-operativa";

export const resourceCategories = [
  { id: "guia", label: "Guías" },
  { id: "plantilla", label: "Plantillas" },
  { id: "caso", label: "Casos prácticos" },
  { id: "articulo", label: "Artículos" },
] as const;

type ResourceCategory = (typeof resourceCategories)[number]["id"];

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  terms: readonly string[];
  read: string;
  level: "Inicial" | "Intermedio";
  updated: string;
  cover?: string;
  scope: string;
  file?: { href: string; format: "PDF" | "XLSX"; mime: string };
};

const updated = "2026-11-20";
const pdf = (slug: EditionSlug) => ({
  cover: `/recursos/portadas/${slug}.webp`,
  file: { href: `/recursos/archivos/${slug}.pdf`, format: "PDF", mime: "application/pdf" } as const,
});

export const resources: readonly Resource[] = [
  {
    id: "primeros-pasos",
    title: "Antes de invertir",
    description: "Compara acciones, ETF y criptoactivos mediante ejercicios de costos, concentración y riesgo.",
    category: "guia",
    terms: ["inversión", "ahorro", "riesgo", "lista"],
    read: "/recursos/guias/primeros-pasos/",
    level: "Inicial", updated, scope: "8 páginas",
    ...pdf("primeros-pasos-para-invertir"),
  },
  {
    id: "escenarios",
    title: "Laboratorio financiero",
    description: "Organiza presupuesto, escenarios, inversiones y riesgo en hojas editables con ejemplos y gráficos vinculados.",
    category: "plantilla",
    terms: ["flujo de caja", "riesgo", "hoja de cálculo", "costos", "Excel"],
    read: "/recursos/guias/#comparar-escenarios",
    level: "Intermedio", updated, scope: "6 hojas",
    cover: "/recursos/portadas/laboratorio-financiero.webp",
    file: { href: "/recursos/archivos/laboratorio-financiero.xlsx", format: "XLSX",
      mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  },
  {
    id: "lectura-mercados",
    title: "Cómo leer un movimiento de mercado",
    description: "Distingue precio, volumen y contexto del emisor usando datos ficticios y preguntas de verificación.",
    category: "caso",
    terms: ["mercados", "análisis técnico", "análisis fundamental", "indicadores"],
    read: "/recursos/articulos/#lectura-de-mercados",
    level: "Intermedio", updated, scope: "8 páginas",
    ...pdf("lectura-de-mercados"),
  },
  {
    id: "liquidez",
    title: "Liquidez operativa bajo presión",
    description: "Calcula el saldo de caja y detecta una brecha al simular un retraso en los cobros.",
    category: "caso",
    terms: ["empresa", "tesorería", "flujo de caja", "cobros"],
    read: "/recursos/guias/#liquidez-operativa",
    level: "Intermedio", updated, scope: "8 páginas",
    ...pdf("liquidez-operativa"),
  },
  {
    id: "diversificacion",
    title: "Qué es diversificar una inversión",
    description: "Identifica concentraciones ocultas y entiende qué riesgos se mantienen al diversificar.",
    category: "articulo",
    terms: ["riesgo", "cartera", "fondos"],
    read: "/recursos/articulos/que-es-diversificar/",
    level: "Inicial", updated, scope: "Lectura web",
  },
  {
    id: "inflacion",
    title: "Qué es la inflación y cómo comparar precios",
    description: "Entiende qué representa el IPC y qué comprobar antes de comparar importes de períodos distintos.",
    category: "articulo",
    terms: ["IPC", "precios", "poder adquisitivo"],
    read: "/recursos/articulos/#inflacion",
    level: "Inicial", updated, scope: "Lectura web",
  },
];
