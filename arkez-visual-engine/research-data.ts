import type { Research } from "./schemas/research";

export const nubank: Research = {
  slug: "nubank", name: "Nubank", legalName: "Nu Holdings Ltd.", ticker: "NU", exchange: "NYSE",
  summary: "Un caso de estudio para entender la banca digital y su expansión en América Latina.",
  period: "Cierre del ejercicio 2024 · 31 dic 2024",
  source: { title: "Nu Holdings · Resultados oficiales de 2024", href: "https://nu.com/en/newsroom/company/nu-holdings-ltd-reports-fourth-quarter-and-full-year-2024-financial-results", published: "20 feb 2025" },
  accounts: { title: "SEC · Estados financieros consolidados 2024 (6-K)", href: "https://www.sec.gov/Archives/edgar/data/1691493/000129281425000480/nufs4q24_6k.htm", published: "20 feb 2025" },
  financials: [
    { year: "2023", revenue: 8028.976, gross: 3491, net: 1030.530, eps: .2175 },
    { year: "2024", revenue: 11517.075, gross: 5252.9, net: 1972.112, eps: .4115 },
  ],
  indicators: [
    { label: "Clientes", value: "114,2 M", detail: "Total al cierre de 2024" },
    { label: "Ingresos", value: "US$ 11.517 M", detail: "Ejercicio 2024" },
    { label: "Beneficio bruto", value: "US$ 5.252,9 M", detail: "Ejercicio 2024" },
    { label: "Beneficio neto", value: "US$ 1.972,1 M", detail: "Ejercicio 2024" },
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
  strengths: ["Escala regional de clientes", "Distribución digital en varios mercados", "Crecimiento de ingresos y beneficio en 2024"],
  risks: ["Calidad y concentración de la cartera", "Regulación diferente en cada mercado", "Competencia y costos de financiación"],
  conclusion: "Para evaluar el crecimiento de un banco digital, compara los ingresos con el costo de financiar el crédito y las pérdidas de cartera. Una base de clientes creciente no basta para explicar su rentabilidad.",
};
