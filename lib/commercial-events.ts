export const commercialEventChannel = "arkez:commercial";
export type CommercialEvent =
  | { type: "service_click"; destination: string }
  | { type: "calculator_use"; action: "open" | "calculate" | "compare" }
  | { type: "contact_click"; service: string | null }
  | { type: "inquiry_submitted"; mode: "local_test"; service: string; sourcePage: string | null };

export const contactChoices = [
  ["educacion-financiera", "Aprender a invertir desde cero"],
  ["analisis-de-mercados", "Aprender a analizar los mercados"],
  ["finanzas-empresariales", "Finanzas para mi empresa"],
  ["formacion-practica", "Formación práctica en inversiones"],
  ["consultoria-financiera", "Consultoría financiera"],
] as const;

export function recordCommercialEvent(event: CommercialEvent) {
  window.dispatchEvent(new CustomEvent(commercialEventChannel, {
    detail: { ...event, page: window.location.pathname },
  }));
}


// Keep only known public paths. Query strings, fragments and external referrers stay out.
export function contactSourcePage() {
  if (!document.referrer) return null;
  const referrer = new URL(document.referrer);
  if (referrer.origin !== window.location.origin) return null;
  const knownPaths = [
    "/", "/servicios/", ...contactChoices
      .filter(([id]) => id !== "finanzas-empresariales")
      .map(([id]) => `/servicios/${id}/`),
    "/servicios/metodologia/", "/para-quien/", "/para-quien/personas/", "/para-quien/empresas/",
    "/herramientas/", "/herramientas/interes-compuesto/", "/actualidad/", "/ecosistema/",
    "/recursos/", "/recursos/guias/", "/recursos/guias/primeros-pasos/", "/recursos/articulos/",
    "/recursos/articulos/que-es-diversificar/", "/recursos/preguntas-frecuentes/",
    "/nosotros/", "/nosotros/mision-y-equipo/", "/nosotros/transparencia/", "/innovacion/",
    "/legal/privacidad/", "/legal/terminos/", "/legal/riesgos/",
  ];
  return knownPaths.includes(referrer.pathname) ? referrer.pathname : null;
}
