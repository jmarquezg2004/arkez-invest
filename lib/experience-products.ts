type Product =
  | { state: "available"; route: `/${string}/` }
  | { state: "pending"; demo: `#${string}`; needs: string };

export const experienceProducts = {
  compound: { state: "available", route: "/herramientas/interes-compuesto/" },
  ledger: { state: "pending", demo: "#registro", needs: "Repositorio autorizado, esquema de movimientos y política de datos." },
  property: { state: "pending", demo: "#inmuebles", needs: "Repositorio y modelo financiero del evaluador original." },
  infrastructure: { state: "pending", demo: "#mapa-ia", needs: "Artefacto original, derechos de uso y fuentes por relación." },
  companies: { state: "pending", demo: "#mapa-ia", needs: "Conjunto de empresas y vínculos documentados, fecha y responsable editorial." },
} as const satisfies Record<string, Product>;

export const tiers = [
  {
    name: "Empieza", audience: "Si estás empezando",
    title: "Compara antes de invertir.",
    benefit: "Entiende qué significa invertir, qué puedes perder y qué conviene comparar.",
    tools: [
      { label: "Calculadora de interés compuesto", href: experienceProducts.compound.route },
      { label: "Guía para empezar a invertir", href: "/recursos/guias/primeros-pasos/" },
      { label: "Demostraciones y educación inicial", href: "/herramientas/" },
    ],
  },
  {
    name: "Aplica", audience: "Si ya conoces lo básico",
    title: "Ordena tus decisiones.",
    benefit: "Reúne ejemplos de distintas plataformas y pon a prueba una decisión con cifras.",
    tools: [
      { label: "Vista previa del registro", href: experienceProducts.ledger.demo },
      { label: "Evaluador inmobiliario de ejemplo", href: experienceProducts.property.demo },
      { label: "Mapa interactivo de relaciones", href: experienceProducts.infrastructure.demo },
      { label: "Plantillas educativas", href: "/recursos/guias/" },
      { label: "Formación en análisis", href: "/servicios/analisis-de-mercados/" },
    ],
  },
  {
    name: "Expande", audience: "Para profesionales y empresas",
    title: "Elige tecnología con un propósito.",
    benefit: "Explora cómo planear, evaluar herramientas e incorporar IA en un proceso.",
    tools: [
      { label: "Planificación financiera", href: "/para-quien/empresas/" },
      { label: "IA aplicada y alternativas tecnológicas", href: experienceProducts.infrastructure.demo },
      { label: "Consultar sobre operaciones internacionales", href: "/contacto/?servicio=consultoria-financiera" },
    ],
  },
] as const;
