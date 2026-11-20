import { innovationLink } from "./navigation";

export const innovationPath = innovationLink.href;
export const innovationTitle = "Innovación financiera: inteligencia artificial, DeFi y nuevas oportunidades de inversión";
export const innovationDescription = "Explora activos tokenizados, DeFi e inteligencia artificial aplicada a inversiones. Compara portafolios ficticios y practica cómo evaluar sus riesgos.";
export const innovationUpdated = "2026-11-20";

export const innovationTopics = [
  {
    id: "portafolios", title: "Portafolios híbridos y tokenización", short: "Activos y derechos",
    summary: "Compara acciones, ETF, bonos, criptoactivos y activos del mundo real tokenizados según los riesgos y derechos de cada instrumento.",
    explanation: "Un portafolio híbrido combina instrumentos tradicionales y digitales. Un token de un activo del mundo real (RWA) puede representar un derecho económico, un crédito o una participación. Para entender qué recibe el tenedor hay que revisar el contrato, el emisor y la relación jurídica con el activo subyacente.",
    example: "Dos instrumentos pueden seguir el mismo bono. Si uno se negocia en un mercado y otro se redime mediante un proveedor, verifica por separado el plazo, la custodia y el costo de salida.",
    risk: "Un formato distinto puede añadir riesgo de contraparte, custodia y liquidez. Revisa también las exposiciones subyacentes de los ETF para identificar riesgos repetidos.",
    steps: ["Activo subyacente", "Contrato y derechos", "Custodia", "Redención"],
    visual: "Del activo al derecho de redención",
    resource: { href: "/recursos/guias/primeros-pasos/", label: "Leer la guía para empezar a invertir" },
  },
  {
    id: "defi", title: "Finanzas descentralizadas", short: "Protocolos y liquidez",
    summary: "Examina cómo funcionan los protocolos DeFi, los fondos de liquidez y el staking, y qué puede fallar al intentar retirar activos.",
    explanation: "Las finanzas descentralizadas usan contratos inteligentes para automatizar operaciones como intercambios o préstamos. El staking nativo vincula activos al mecanismo de consenso de ciertas redes. Algunos proveedores llaman staking a otros esquemas, por lo que conviene identificar de dónde sale cada incentivo.",
    example: "En un intercambio ficticio, una cotización muestra 100 unidades de salida y la ejecución devuelve 97. La diferencia del 3 % ilustra el deslizamiento. Repite el ejemplo con una orden menor y compara la diferencia.",
    risk: "Revisa fallos de código, dependencia de oráculos, cambios de gobernanza, liquidez y períodos de desbloqueo. En staking nativo también puede haber penalizaciones según la red.",
    steps: ["Orden", "Contrato", "Fondo de liquidez", "Liquidación"],
    visual: "Recorrido de un intercambio DeFi",
    resource: { href: "/legal/riesgos/", label: "Entender el riesgo financiero" },
  },
  {
    id: "ia", title: "Inteligencia artificial financiera", short: "Fuentes y verificación",
    summary: "Usa la IA para organizar fuentes, preparar preguntas y estudiar mercados. Antes de usar una cifra, contrástala con su documento original.",
    explanation: "La IA puede resumir informes, extraer datos y ayudar a automatizar pasos de investigación. Una respuesta plausible puede omitir una nota importante, mezclar períodos o inventar una cifra. Guarda la fuente, el período, la moneda y la unidad para reproducir la comparación.",
    example: "Pide un resumen de dos informes públicos de un emisor. Verifica ingresos, deuda y flujo de caja contra las tablas originales. Si uno usa millones y el otro miles, homologa la unidad antes de comparar.",
    risk: "El modelo puede incurrir en errores o hacer afirmaciones difíciles de verificar. Evita enviar información personal o confidencial y conserva la revisión humana antes de tomar decisiones.",
    steps: ["Informe público", "Síntesis con IA", "Cruce de cifras", "Revisión humana"],
    visual: "Cadena de verificación de una cifra",
    resource: { href: "/servicios/analisis-de-mercados/", label: "Explorar el análisis de mercados" },
  },
  {
    id: "academia", title: "Academia financiera digital", short: "Aprendizaje aplicado",
    summary: "Relaciona cursos y guías con ejercicios, casos y simulaciones que te permitan explicar un resultado con tus propias palabras.",
    explanation: "Un itinerario de aprendizaje puede empezar con liquidez, horizonte y riesgo, y pasar a casos en los que se modifica un supuesto a la vez. Comparar el resultado con la hipótesis inicial ayuda a distinguir un error de cálculo de un supuesto poco realista.",
    example: "En la hoja de escenarios del Laboratorio financiero, retrasa un cobro 30 días y mantén los pagos fijos. Anota en qué momento aparece una brecha de caja y qué datos faltaría verificar.",
    risk: "Un caso de práctica simplifica el mercado. Documenta comisiones, impuestos, restricciones y supuestos que debas incorporar para evaluar una situación real.",
    steps: ["Concepto", "Caso de práctica", "Comparación", "Evaluación"],
    visual: "Ciclo de aprendizaje aplicado",
    resource: { href: "/recursos/guias/#comparar-escenarios", label: "Abrir el caso de escenarios y la plantilla" },
  },
  {
    id: "ecosistema", title: "Ecosistema Arkez", short: "Criterios compartidos",
    summary: "Conecta investigación financiera, contenidos y herramientas fintech con el trabajo de personas y equipos.",
    explanation: "La investigación es más fácil de compartir cuando los conceptos, fuentes y supuestos quedan por escrito. Un equipo puede acordar qué significa un indicador, quién verifica los datos y cuándo se revisarán los resultados.",
    example: "Empieza con una pregunta, por ejemplo si la caja cubre los pagos del próximo mes. Un integrante registra las fuentes, otro contrasta el escenario y el equipo acuerda qué indicador volverá a revisar.",
    risk: "Define responsabilidades y conserva versiones de los supuestos. Una herramienta tecnológica aporta datos al proceso y el equipo sigue siendo responsable de interpretar su alcance.",
    steps: ["Pregunta", "Evidencia", "Trabajo en equipo", "Seguimiento"],
    visual: "De una pregunta a un criterio compartido",
    resource: { href: "/para-quien/empresas/", label: "Ver el enfoque de Arkez para empresas" },
  },
] as const;

export type InnovationTopic = (typeof innovationTopics)[number];

export const innovationFaq = [
  { question: "¿Tokenizar un activo reduce su riesgo?", answer: "Depende de la estructura. La tokenización cambia cómo se representa un derecho y puede cambiar su custodia, transferencia o redención. El activo subyacente y el emisor siguen importando, y la infraestructura puede añadir riesgos propios." },
  { question: "¿Qué diferencia hay entre aportar liquidez y hacer staking?", answer: "Aportar liquidez facilita intercambios u otras operaciones de un protocolo. El staking nativo participa en el consenso de algunas redes. Cada actividad tiene reglas y riesgos distintos, incluida la posibilidad de pérdidas." },
  { question: "¿Puedo usar una respuesta de IA como fuente financiera?", answer: "Úsala para localizar dudas o resumir documentos. Verifica cada afirmación importante en una fuente primaria y revisa fecha, moneda y unidad antes de incorporarla a un análisis." },
  { question: "¿Qué muestra el simulador de Arkez?", answer: "Muestra cómo varían dos carteras ficticias ante un choque común. El resultado depende de los pesos y los supuestos elegidos. Es un ejercicio educativo y no constituye una recomendación personalizada ni una estimación de rentabilidad." },
] as const;

export const innovationSources = [
  { href: "https://www.bis.org/publications/aer-2023/blueprint-future-monetary-system-improving-old-enabling-new", label: "BIS · Activos tokenizados y sistemas financieros" },
  { href: "https://www.bis.org/publ/qtrpdf/r_qt2112b.htm", label: "BIS · Finanzas descentralizadas y sus riesgos" },
  { href: "https://www.nist.gov/itl/ai-risk-management-framework", label: "NIST · Marco para gestionar los riesgos de la IA" },
] as const;
