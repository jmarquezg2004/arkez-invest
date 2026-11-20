import { contactLink, educationLink, firstGuideLink, siteDescription, type SiteLink } from "./navigation";

export type IconName = "book" | "layers" | "compass" | "shield" | "building" | "users" | "chart" | "file" | "message";

export type ContentCard = SiteLink & {
  description: string;
  icon: IconName;
};

type ContentSection = { id?: string; title: string; body: string };

export type ContentPage = {
  title: string;
  description: string;
  group: string;
  sections?: readonly ContentSection[];
  cards?: readonly ContentCard[];
  faq?: readonly ContentSection[];
  next?: SiteLink;
};

const services = [
  {
    id: "educacion-financiera",
    title: "Educación financiera",
    description: "Comprende los conceptos que sustentan tus decisiones de ahorro, financiación e inversión.",
    body: "Desarrolla una base para entender instrumentos, costos y riesgos. Aprende a relacionar estas variables con el objetivo, el plazo y la liquidez de cada decisión.",
    icon: "book",
  },
  {
    id: "analisis-de-mercados",
    title: "Análisis de mercados",
    description: "Interpreta tendencias, indicadores y fuentes de información financiera.",
    body: "Aprende a leer indicadores en contexto, comparar fuentes y reconocer los supuestos detrás de una interpretación. El análisis ayuda a formular preguntas y evaluar escenarios.",
    icon: "chart",
  },
  {
    id: "formacion-practica",
    title: "Formación práctica",
    description: "Aplica conceptos y herramientas digitales con ejercicios y escenarios ilustrativos.",
    body: "Organiza datos, compara alternativas y documenta tus supuestos en ejercicios que conectan los conceptos con decisiones de personas y empresas.",
    icon: "layers",
  },
  {
    id: "consultoria-financiera",
    title: "Consultoría financiera",
    description: "Estructura preguntas, criterios y escenarios para decisiones de personas y empresas.",
    body: "La consultoría se orienta a comprender una situación financiera, identificar la información necesaria y estructurar el análisis de alternativas para tomar decisiones.",
    icon: "compass",
  },
] satisfies readonly (ContentSection & { id: string; description: string; icon: IconName })[];

export const serviceCards: readonly ContentCard[] = services.map(({ id, title, description, icon }) => ({
  href: `/servicios/#${id}`,
  label: title,
  description,
  icon,
}));

const educationCard: ContentCard = {
  ...educationLink,
  description: "Comprende los mercados, sus instrumentos y la relación entre riesgo y plazo.",
  icon: "book",
};

const methodologyCard: ContentCard = {
  label: "Metodología",
  href: "/servicios/metodologia/",
  description: "Aprende con preguntas concretas, ejemplos y criterios que puedes aplicar por tu cuenta.",
  icon: "compass",
};

const guidesCard: ContentCard = {
  label: "Guías prácticas",
  href: "/recursos/guias/",
  description: "Ordena tus objetivos y aprende qué revisar antes de evaluar una inversión.",
  icon: "layers",
};

const articlesCard: ContentCard = {
  label: "Artículos",
  href: "/recursos/articulos/",
  description: "Explora conceptos de inversión con ejemplos breves y lenguaje claro.",
  icon: "file",
};

const riskCard: ContentCard = {
  label: "Entender el riesgo",
  href: "/legal/riesgos/",
  description: "Identifica las pérdidas posibles, la volatilidad, la liquidez y otros riesgos.",
  icon: "shield",
};

const personsCard: ContentCard = {
  label: "Personas",
  href: "/para-quien/personas/",
  description: "Aprende a evaluar decisiones financieras según tus objetivos y tu horizonte.",
  icon: "users",
};

const businessCard: ContentCard = {
  label: "Empresas",
  href: "/para-quien/empresas/",
  description: "Explora conceptos de liquidez, planificación y riesgo para tu negocio.",
  icon: "building",
};

const startingCard: ContentCard = {
  ...firstGuideLink,
  description: "Cinco preguntas para definir el objetivo, el plazo y el riesgo antes de invertir.",
  icon: "compass",
};

const diversificationCard: ContentCard = {
  label: "Qué significa diversificar",
  href: "/recursos/articulos/que-es-diversificar/",
  description: "Descubre por qué repartir una inversión puede reducir su concentración y qué riesgos permanecen.",
  icon: "chart",
};

export const methodologySteps: readonly ContentSection[] = [
  { title: "Diagnóstico", body: "Identificamos el punto de partida, los objetivos y las decisiones que requieren mayor claridad." },
  { title: "Formación práctica", body: "Trabajamos conceptos financieros mediante ejercicios y casos vinculados con los objetivos del diagnóstico." },
  { title: "Aplicación de herramientas", body: "Usamos fuentes y herramientas digitales para organizar datos, comparar escenarios y documentar supuestos." },
  { title: "Evaluación del aprendizaje", body: "Revisamos cómo se aplicaron los conceptos a un caso e identificamos qué habilidades conviene reforzar." },
];

export const pages: Readonly<Record<string, ContentPage>> = {
  "/servicios/": {
    title: "Servicios",
    group: "Arkez Invest",
    description: "Educación financiera, análisis de mercados, formación práctica y consultoría para personas y empresas.",
    sections: services,
    cards: [educationCard, methodologyCard],
  },
  "/servicios/educacion-financiera/": {
    title: "Educación financiera",
    group: "Servicios",
    description: "Desarrolla conocimientos para analizar decisiones financieras, entender los mercados y evaluar los riesgos de distintos instrumentos.",
    sections: [
      { title: "Fundamentos de inversión", body: "Explora la relación entre objetivos, horizonte, liquidez y tolerancia a pérdidas. Aprende a distinguir una explicación educativa de una recomendación personalizada." },
      { title: "Cómo funcionan los instrumentos", body: "Conoce las diferencias entre acciones, fondos, ETF y activos digitales. Cada instrumento tiene condiciones, costos y riesgos propios." },
      { title: "Cómo leer la información", body: "Usa herramientas digitales para comparar fuentes, verificar su fecha y distinguir datos, opiniones y supuestos." },
    ],
    next: firstGuideLink,
  },
  "/servicios/metodologia/": {
    title: "Nuestra metodología",
    group: "Servicios",
    description: "Conectamos conceptos financieros, análisis de escenarios y herramientas digitales para ejercitar la toma de decisiones.",
    sections: methodologySteps,
    next: { label: "Ver guías prácticas", href: guidesCard.href },
  },
  "/para-quien/": {
    title: "¿Para quién es Arkez Invest?",
    group: "Arkez Invest",
    description: "Formación y consultoría financiera para personas y empresas que quieren desarrollar sus capacidades de análisis.",
    cards: [personsCard, businessCard],
  },
  "/para-quien/personas/": {
    title: "Para personas",
    group: "Para quién",
    description: "Desarrolla habilidades para entender tus finanzas, evaluar información y comparar alternativas según tus objetivos.",
    sections: [
      { title: "Si estás empezando", body: "Diferencia ahorro, inversión y dinero para gastos próximos. Establecer esa distinción te ayuda a entender qué dinero puedes exponer a pérdidas y durante cuánto tiempo." },
      { title: "Si ya inviertes", body: "Revisa si tu exposición se concentra en un solo mercado, sector, emisor o moneda. Comprueba también los costos y las condiciones para retirar el dinero." },
    ],
    next: firstGuideLink,
  },
  "/para-quien/empresas/": {
    title: "Para empresas",
    group: "Para quién",
    description: "Formación y consultoría para fortalecer el análisis financiero y la planificación de tu empresa.",
    sections: [
      { title: "Liquidez operativa", body: "Identifica cuándo vence cada obligación y qué recursos necesitas mantener disponibles para operar." },
      { title: "Horizonte y escenarios", body: "Distingue los recursos de corto plazo de aquellos con un horizonte mayor. Examina el impacto de cambios en ingresos, costos o tipo de cambio." },
    ],
    next: { label: "Conocer la metodología", href: methodologyCard.href },
  },
  "/recursos/": {
    title: "Recursos para aprender",
    group: "Arkez Invest",
    description: "Guías, artículos y respuestas para practicar el análisis financiero y entender los mercados y sus riesgos.",
    cards: [guidesCard, articlesCard, {
      label: "Preguntas frecuentes",
      href: "/recursos/preguntas-frecuentes/",
      description: "Conoce el alcance de los contenidos y encuentra un buen punto de partida.",
      icon: "message",
    }],
  },
  "/recursos/guias/": {
    title: "Guías prácticas",
    group: "Recursos",
    description: "Ejercicios y preguntas para revisar fuentes, comparar escenarios y evaluar información financiera.",
    cards: [startingCard, riskCard],
  },
  "/recursos/guias/primeros-pasos/": {
    title: "Primeros pasos para invertir",
    group: "Guías",
    description: "Una guía de formación con cinco preguntas para ordenar tu decisión antes de comparar instrumentos.",
    sections: [
      { title: "¿Cuál es tu objetivo?", body: "Expresa para qué necesitas el dinero. Un objetivo concreto te ayuda a comparar alternativas con el mismo propósito." },
      { title: "¿Cuándo lo necesitarás?", body: "Distingue entre una fecha definida y un horizonte flexible. Revisa también cuánto tardarías en disponer del dinero." },
      { title: "¿Qué pérdida podrías asumir?", body: "Piensa cómo afectaría una caída a tu objetivo y a tus otros gastos. Separa tu capacidad financiera de tu comodidad con la volatilidad." },
      { title: "¿Cómo funciona y cuánto cuesta?", body: "Revisa la documentación del instrumento y las comisiones, impuestos u otros costos aplicables. Identifica de qué depende su resultado." },
      { title: "¿Qué falta verificar?", body: "Anota la fuente consultada, sus posibles conflictos de interés y lo que desconoces antes de tomar una decisión." },
    ],
    next: { label: "Revisar los riesgos", href: riskCard.href },
  },
  "/recursos/articulos/": {
    title: "Artículos de educación financiera",
    group: "Recursos",
    description: "Explicaciones en español para interpretar los mercados, entender el riesgo y aplicar conceptos financieros.",
    cards: [diversificationCard],
  },
  "/recursos/articulos/que-es-diversificar/": {
    title: "Qué significa diversificar",
    group: "Artículos",
    description: "Diversificar consiste en repartir la exposición para depender menos de un único resultado. Este artículo explica cómo analizar esa exposición.",
    sections: [
      { title: "Mira lo que hay debajo", body: "Dos fondos pueden parecer distintos y tener las mismas empresas principales. Compara sus posiciones para saber cuánto se solapan." },
      { title: "Revisa más de una dimensión", body: "Sectores, países, monedas, emisores y tipos de instrumento son dimensiones diferentes. Algunas exposiciones se pueden mover en la misma dirección ante un evento." },
      { title: "La pérdida sigue siendo posible", body: "Una cartera diversificada puede perder valor. La diversificación ayuda a gestionar exposición y concentración. Su efecto depende de los activos y del escenario." },
    ],
    next: { label: "Explorar la guía de inicio", href: firstGuideLink.href },
  },
  "/recursos/preguntas-frecuentes/": {
    title: "Preguntas frecuentes",
    group: "Recursos",
    description: "Respuestas sobre la formación, la consultoría y el uso de los recursos de Arkez Invest.",
    faq: [
      { title: "¿Por dónde empiezo?", body: "La guía Primeros pasos para invertir reúne cinco preguntas sobre objetivos, plazos, pérdidas, costos y fuentes." },
      { title: "¿El contenido es una recomendación de inversión?", body: "Los contenidos de este sitio son educativos y generales. Cada decisión depende de las circunstancias, objetivos y riesgos de quien la toma." },
      { title: "¿Puedo abrir una cuenta desde el sitio?", body: "La actividad de Arkez Invest se centra en educación, formación y consultoría. La apertura de cuentas, la custodia de activos y la ejecución de operaciones quedan fuera de su actividad." },
      { title: "¿Puedo enviar documentos o datos financieros?", body: "La vista previa carece de canales de envío. Evita compartir documentos de identidad o información financiera para consultas educativas generales." },
    ],
    next: firstGuideLink,
  },
  "/nosotros/": {
    title: "Sobre Arkez Invest",
    group: "Arkez Invest",
    description: siteDescription,
    cards: [
      { label: "Misión y equipo", href: "/nosotros/mision-y-equipo/", description: "Conoce el propósito y el enfoque de Arkez Invest.", icon: "users" },
      { label: "Transparencia", href: "/nosotros/transparencia/", description: "Consulta el alcance de los contenidos y la forma de presentarlos.", icon: "shield" },
    ],
  },
  "/nosotros/mision-y-equipo/": {
    title: "Misión y equipo",
    group: "Nosotros",
    description: "Fortalecer las capacidades financieras de personas y empresas mediante educación, formación práctica y consultoría.",
    sections: [
      { title: "Nuestra misión", body: "Hacer comprensibles los conceptos financieros y desarrollar la capacidad de interpretar mercados, evaluar riesgos y tomar decisiones informadas." },
      { title: "Nuestro enfoque", body: "Combinamos conceptos financieros, análisis de mercados y herramientas tecnológicas. Integramos herramientas fintech en ejercicios para organizar y comparar información financiera." },
    ],
    next: { label: "Ver transparencia", href: "/nosotros/transparencia/" },
  },
  "/nosotros/transparencia/": {
    title: "Transparencia",
    group: "Nosotros",
    description: "Conoce el alcance de nuestros recursos, nuestra formación y la consultoría financiera.",
    sections: [
      { title: "Alcance de nuestra actividad", body: "Arkez Invest presta servicios de educación, formación y consultoría financiera. La apertura de cuentas, la intermediación de operaciones y la custodia de activos quedan fuera de su actividad." },
      { title: "Ejemplos y referencias", body: "Los ejemplos y gráficos usan información ilustrativa para explicar conceptos. Para comparar instrumentos específicos, consulta la documentación oficial del emisor y verifica su vigencia." },
    ],
    cards: [riskCard],
  },
  "/contacto/": {
    title: "Contacto",
    group: "Arkez Invest",
    description: "Información de contacto para consultas sobre educación, formación y consultoría financiera.",
    sections: [
      { title: "Canales de contacto", body: "Los canales oficiales se habilitarán tras su verificación. Puedes consultar los servicios y recursos disponibles en esta vista previa." },
    ],
    next: { label: "Explorar los recursos", href: "/recursos/" },
  },
  "/legal/privacidad/": {
    title: "Privacidad",
    group: "Información del sitio",
    description: "Información sobre el manejo de datos durante la revisión de este sitio informativo de Arkez Invest.",
    sections: [
      { title: "Datos en esta versión", body: "El sitio carece de formularios, cuentas y herramientas de analítica. El operador del entorno de vista previa puede generar registros técnicos de acceso." },
      { title: "Antes de habilitar contacto", body: "La versión con contacto deberá identificar al responsable del tratamiento y explicar las finalidades, destinatarios, conservación y el canal para ejercer derechos aplicables." },
    ],
  },
  "/legal/terminos/": {
    title: "Términos de uso de la vista previa",
    group: "Información del sitio",
    description: "Condiciones de consulta para la revisión de los contenidos y la presentación de servicios de Arkez Invest.",
    sections: [
      { title: "Uso informativo", body: "El sitio presenta información sobre educación, formación y consultoría financiera y ofrece recursos educativos generales. La vista previa permite revisar estos contenidos antes de su publicación." },
      { title: "Decisiones de inversión", body: "Verifica los datos con las fuentes originales y valora tus circunstancias y el riesgo antes de invertir." },
    ],
  },
  "/legal/riesgos/": {
    title: "Riesgos de inversión",
    group: "Información del sitio",
    description: "Conceptos para identificar y evaluar riesgos de inversión, incluida la posibilidad de perder parte o todo el capital.",
    sections: [
      { title: "Mercado y liquidez", body: "El precio puede bajar y puede resultar difícil vender al precio o en el momento esperado." },
      { title: "Moneda, concentración y contraparte", body: "El tipo de cambio puede afectar el resultado. La exposición a pocas posiciones o a una única contraparte puede amplificar las pérdidas." },
      { title: "Activos digitales", body: "Además de la volatilidad, considera el riesgo operativo, la custodia, el protocolo y los cambios regulatorios que puedan afectar al instrumento." },
    ],
    next: contactLink,
  },
};
