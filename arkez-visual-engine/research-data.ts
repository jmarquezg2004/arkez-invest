import type { Research } from "./schemas/research";

export const nubank: Research = {
  slug: "nubank", name: "Nubank", legalName: "Nu Holdings Ltd.", ticker: "NU", exchange: "NYSE",
  summary: "Un caso de estudio para entender la banca digital y su expansión en América Latina.",
  period: "Cierre del ejercicio 2025 · 31 dic 2025",
  source: { title: "Nu Holdings · Resultados oficiales de 2025", href: "https://nu.com/en/newsroom/company/nu-holdings-ltd-reports-fourth-quarter-and-full-year-2025-financial-results", published: "25 feb 2026" },
  accounts: { title: "SEC · Estados financieros auditados 2025 (20-F)", href: "https://www.sec.gov/Archives/edgar/data/1691493/000129281426002166/nuform20f_2025.htm", published: "8 abr 2026" },
  financials: [
    { year: "2024", revenue: 11517.075, gross: 5252.909, net: 1972.112, eps: .4115 },
    { year: "2025", revenue: 15774.741, gross: 6625.002, net: 2871.672, eps: .5936 },
  ],
  indicators: [
    { label: "Clientes", value: "131 M", detail: "Total al cierre de 2025" },
    { label: "Ingresos", value: "US$ 15.774,7 M", detail: "Ejercicio 2025" },
    { label: "Beneficio bruto", value: "US$ 6.625,0 M", detail: "Ejercicio 2025" },
    { label: "Beneficio neto", value: "US$ 2.871,7 M", detail: "Ejercicio 2025" },
  ],
  markets: [
    { name: "Brasil", capital: "BR", detail: "Mercado de origen. Es el punto de partida para estudiar cómo una plataforma digital llega a escala." },
    { name: "México", capital: "MX", detail: "Caso para examinar cómo se adapta la oferta al contexto competitivo local." },
    { name: "Colombia", capital: "CO", detail: "Caso para observar la expansión regional y las diferencias en regulación y productos." },
  ],
  model: [
    { title: "Clientes", detail: "La distribución digital facilita el acceso a la oferta financiera." },
    { title: "Depósitos", detail: "Contribuyen a la financiación de las actividades del negocio." },
    { title: "Crédito", detail: "Parte de los ingresos proviene del crédito. Importa cuánto cuesta financiarlo y cuánto se pierde por impago." },
    { title: "Servicios", detail: "Las tarjetas y otros servicios complementan la relación con los usuarios." },
  ],
  strengths: ["Escala regional de clientes", "Distribución digital en varios mercados", "Crecimiento de ingresos y beneficio en 2025"],
  risks: ["Calidad y concentración de la cartera", "Regulación diferente en cada mercado", "Competencia y costos de financiación"],
  conclusion: "Para evaluar el crecimiento de un banco digital, compara los ingresos con el costo de financiar el crédito y las pérdidas de cartera. Una base de clientes creciente no basta para explicar su rentabilidad.",
};
