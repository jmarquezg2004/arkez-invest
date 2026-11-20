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
  file?: { href: string; format: "PDF" | "CSV" };
};

export const resources: readonly Resource[] = [
  {
    id: "primeros-pasos",
    title: "Lista de comprobación antes de invertir",
    description: "Ordena el objetivo, plazo, liquidez, costos y fuentes antes de comparar instrumentos.",
    category: "guia",
    terms: ["inversión", "ahorro", "riesgo", "lista"],
    read: "/recursos/guias/primeros-pasos/",
    file: { href: "/recursos/archivos/primeros-pasos-para-invertir.pdf", format: "PDF" },
  },
  {
    id: "escenarios",
    title: "Plantilla para comparar escenarios",
    description: "Abre en una hoja de cálculo el caso base y el alternativo. Incluye un ejemplo y filas para tus propios supuestos.",
    category: "plantilla",
    terms: ["flujo de caja", "riesgo", "hoja de cálculo", "costos", "Excel"],
    read: "/recursos/guias/#comparar-escenarios",
    file: { href: "/recursos/archivos/plantilla-escenarios.csv", format: "CSV" },
  },
  {
    id: "lectura-mercados",
    title: "Caso guiado de análisis de mercados",
    description: "Distingue precio, volumen y contexto del emisor usando datos ficticios y preguntas de verificación.",
    category: "caso",
    terms: ["mercados", "análisis técnico", "análisis fundamental", "indicadores"],
    read: "/recursos/articulos/#lectura-de-mercados",
    file: { href: "/recursos/archivos/lectura-de-mercados.pdf", format: "PDF" },
  },
  {
    id: "liquidez",
    title: "Caso de liquidez operativa",
    description: "Calcula el saldo de caja y detecta una brecha al simular un retraso en los cobros.",
    category: "caso",
    terms: ["empresa", "tesorería", "flujo de caja", "cobros"],
    read: "/recursos/guias/#liquidez-operativa",
    file: { href: "/recursos/archivos/liquidez-operativa.pdf", format: "PDF" },
  },
  {
    id: "diversificacion",
    title: "Qué es diversificar una inversión",
    description: "Identifica concentraciones ocultas y entiende qué riesgos se mantienen al diversificar.",
    category: "articulo",
    terms: ["riesgo", "cartera", "fondos"],
    read: "/recursos/articulos/que-es-diversificar/",
  },
  {
    id: "inflacion",
    title: "Qué es la inflación y cómo comparar precios",
    description: "Entiende qué representa el IPC y qué comprobar antes de comparar importes de períodos distintos.",
    category: "articulo",
    terms: ["IPC", "precios", "poder adquisitivo"],
    read: "/recursos/articulos/#inflacion",
  },
];
