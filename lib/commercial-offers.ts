import { serviceHref } from "./navigation";

export const offers = [
  {
    id: "educacion-financiera", href: serviceHref("educacion-financiera"), title: "Aprende a invertir desde cero",
    summary: "Entiende qué opciones tienes, cuánto cuestan y qué riesgos asumes antes de invertir.",
    audience: "Personas que están empezando y quieren prepararse antes de poner dinero en una inversión.",
    contents: "Objetivos de ahorro, plazos, costos y diferencias entre acciones, fondos y ETF.",
    outcome: "Una lista de preguntas que podrás usar para comparar distintas opciones.",
    format: "Formación con ejercicios guiados. Consulta las opciones de modalidad.",
  },
  {
    id: "analisis-de-mercados", href: serviceHref("analisis-de-mercados"), title: "Aprende a analizar los mercados",
    summary: "Interpreta gráficos, noticias y datos sin perder de vista de dónde vienen.",
    audience: "Personas y equipos que leen noticias, gráficos o informes y quieren interpretarlos con criterio.",
    contents: "Lectura de precios y volúmenes, indicadores económicos y fuentes de información.",
    outcome: "Un método para distinguir qué ocurrió, cómo se interpreta y qué falta por verificar.",
    format: "Formación con casos guiados. Consulta las opciones de modalidad.",
  },
  {
    id: "finanzas-empresariales", href: "/para-quien/empresas/", title: "Finanzas para tu empresa",
    summary: "Ordena ingresos y gastos, anticipa faltantes de caja y compara decisiones con tu equipo.",
    audience: "Dueños de empresas y equipos que participan en decisiones de presupuesto, cobro y pago.",
    contents: "Ingresos, gastos, flujo de caja y escenarios de planificación con ejemplos ficticios.",
    outcome: "Un ejercicio de flujo de caja y criterios para examinar qué cambia si se retrasa un cobro.",
    format: "Formación para equipos con ejercicios. Consulta las opciones de modalidad.",
  },
  {
    id: "consultoria-financiera", href: serviceHref("consultoria-financiera"), title: "Consultoría financiera",
    summary: "Ordena una decisión concreta, identifica qué información te falta y compara alternativas.",
    audience: "Personas y empresas que necesitan estructurar una decisión financiera específica.",
    contents: "Diagnóstico, revisión de la información y comparación de supuestos y escenarios.",
    outcome: "Una pregunta bien definida y criterios para evaluar tus alternativas.",
    format: "Acompañamiento basado en un diagnóstico. Consulta las opciones de modalidad.",
  },
  {
    id: "formacion-practica", href: serviceHref("formacion-practica"), title: "Formación práctica en inversiones",
    summary: "Practica cómo comparar inversiones con casos, plantillas y datos ilustrativos.",
    audience: "Personas y equipos que ya manejan conceptos básicos y quieren aplicarlos.",
    contents: "Comparación de instrumentos, costos y escenarios mediante hojas de cálculo.",
    outcome: "Una matriz de comparación que podrás adaptar a otros ejercicios.",
    format: "Formación con casos y herramientas digitales. Consulta las opciones de modalidad.",
  },
] as const;

export function inquiryHref(id: string) {
  return `/contacto/?servicio=${id}`;
}
