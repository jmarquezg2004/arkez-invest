import { contactLink, educationLink, firstGuideLink, type SiteLink } from "./navigation";

export type IconName = "book" | "layers" | "compass" | "shield" | "building" | "users" | "chart" | "file" | "message";

export type ContentCard = SiteLink & {
  description: string;
  icon: IconName;
};

type ContentSection = { title: string; body: string };

export type ContentPage = {
  title: string;
  description: string;
  group: string;
  sections?: readonly ContentSection[];
  cards?: readonly ContentCard[];
  faq?: readonly ContentSection[];
  next?: SiteLink;
};

export const educationCard: ContentCard = {
  ...educationLink,
  description: "Comprende los mercados, sus instrumentos y la relación entre riesgo y plazo.",
  icon: "book",
};

export const methodologyCard: ContentCard = {
  label: "Metodología",
  href: "/servicios/metodologia/",
  description: "Aprende con preguntas concretas, ejemplos y criterios que puedes aplicar por tu cuenta.",
  icon: "compass",
};

export const guidesCard: ContentCard = {
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

export const pages: Readonly<Record<string, ContentPage>> = {
  "/servicios/": {
    title: "Servicios",
    group: "Arkez Invest",
    description: "Educación financiera para entender los mercados y evaluar decisiones con criterio.",
    cards: [educationCard, methodologyCard],
  },
  "/servicios/educacion-financiera/": {
    title: "Educación financiera",
    group: "Servicios",
    description: "Construye una base para entender las decisiones de inversión, el funcionamiento de los mercados y los riesgos de distintos instrumentos.",
    sections: [
      { title: "Fundamentos de inversión", body: "Explora la relación entre objetivos, horizonte, liquidez y tolerancia a pérdidas. Aprende a distinguir una explicación educativa de una recomendación personalizada." },
      { title: "Cómo funcionan los instrumentos", body: "Conoce las diferencias entre acciones, fondos, ETF y activos digitales. Cada instrumento tiene condiciones, costos y riesgos propios." },
      { title: "Cómo leer la información", body: "Aprende a buscar la fuente original, distinguir hechos de opiniones y revisar qué supuestos sostienen una comparación." },
    ],
    next: firstGuideLink,
  },
  "/servicios/metodologia/": {
    title: "Nuestra metodología",
    group: "Servicios",
    description: "Un recorrido de aprendizaje que va de las preguntas básicas a la comparación informada de alternativas.",
    sections: [
      { title: "Define la pregunta", body: "Empieza por tu objetivo, el plazo y las condiciones que podrían cambiar tu decisión." },
      { title: "Entiende las variables", body: "Compara opciones observando costos, liquidez, concentración y escenarios de pérdida." },
      { title: "Contrasta con fuentes", body: "Revisa documentos primarios y comprueba qué parte de la decisión depende de información que todavía falta." },
    ],
    next: { label: "Ver guías prácticas", href: guidesCard.href },
  },
  "/para-quien/": {
    title: "¿Para quién es Arkez Invest?",
    group: "Arkez Invest",
    description: "Recursos de educación financiera para personas y empresas que quieren entender mejor sus decisiones.",
    cards: [personsCard, businessCard],
  },
  "/para-quien/personas/": {
    title: "Para personas",
    group: "Para quién",
    description: "Empieza por las preguntas que importan para tus decisiones financieras personales.",
    sections: [
      { title: "Si estás empezando", body: "Diferencia ahorro, inversión y dinero para gastos próximos. Establecer esa distinción te ayuda a entender qué dinero puedes exponer a pérdidas y durante cuánto tiempo." },
      { title: "Si ya inviertes", body: "Revisa si tu exposición se concentra en un solo mercado, sector, emisor o moneda. Comprueba también los costos y las condiciones para retirar el dinero." },
    ],
    next: firstGuideLink,
  },
  "/para-quien/empresas/": {
    title: "Para empresas",
    group: "Para quién",
    description: "Conceptos que ayudan a plantear mejores preguntas sobre los recursos de un negocio.",
    sections: [
      { title: "Liquidez operativa", body: "Identifica cuándo vence cada obligación y qué recursos necesitas mantener disponibles para operar." },
      { title: "Horizonte y escenarios", body: "Distingue los recursos de corto plazo de aquellos con un horizonte mayor. Examina el impacto de cambios en ingresos, costos o tipo de cambio." },
    ],
    next: { label: "Conocer la metodología", href: methodologyCard.href },
  },
  "/recursos/": {
    title: "Recursos para aprender",
    group: "Arkez Invest",
    description: "Guías, artículos y respuestas para aclarar conceptos y avanzar a tu ritmo.",
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
    description: "Ejercicios y preguntas que puedes usar para evaluar información financiera.",
    cards: [startingCard, riskCard],
  },
  "/recursos/guias/primeros-pasos/": {
    title: "Primeros pasos para invertir",
    group: "Guías",
    description: "Cinco preguntas para ordenar tu decisión antes de comparar instrumentos.",
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
    description: "Explicaciones en español sobre conceptos que aparecen al estudiar inversiones.",
    cards: [diversificationCard],
  },
  "/recursos/articulos/que-es-diversificar/": {
    title: "Qué significa diversificar",
    group: "Artículos",
    description: "Diversificar consiste en repartir la exposición para que una inversión dependa menos de un único resultado.",
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
    description: "Respuestas sobre el propósito de Arkez Invest y cómo utilizar sus contenidos.",
    faq: [
      { title: "¿Por dónde empiezo?", body: "La guía Primeros pasos para invertir reúne cinco preguntas sobre objetivos, plazos, pérdidas, costos y fuentes." },
      { title: "¿El contenido es una recomendación de inversión?", body: "Los contenidos de este sitio son educativos y generales. Cada decisión depende de las circunstancias, objetivos y riesgos de quien la toma." },
      { title: "¿Puedo abrir una cuenta desde el sitio?", body: "Esta versión ofrece recursos educativos. La apertura de cuentas y las operaciones financieras quedan fuera de su alcance." },
      { title: "¿Puedo enviar documentos o datos financieros?", body: "La vista previa carece de canales de envío. Evita compartir documentos de identidad o información financiera para consultas educativas generales." },
    ],
    next: firstGuideLink,
  },
  "/nosotros/": {
    title: "Sobre Arkez Invest",
    group: "Arkez Invest",
    description: "Un proyecto de educación financiera en español, centrado en hacer comprensibles los mercados y sus riesgos.",
    cards: [
      { label: "Misión y equipo", href: "/nosotros/mision-y-equipo/", description: "Conoce el propósito y enfoque del proyecto.", icon: "users" },
      { label: "Transparencia", href: "/nosotros/transparencia/", description: "Consulta el alcance de los contenidos y la forma de presentarlos.", icon: "shield" },
    ],
  },
  "/nosotros/mision-y-equipo/": {
    title: "Misión y equipo",
    group: "Nosotros",
    description: "Acercar la educación financiera a personas y empresas con contenidos claros, prácticos y orientados a entender el riesgo.",
    sections: [
      { title: "Nuestra misión", body: "Hacer más comprensibles los conceptos financieros y ofrecer herramientas educativas para que cada persona pueda plantear mejores preguntas sobre sus decisiones." },
      { title: "Nuestro enfoque", body: "Partimos de conceptos básicos y avanzamos hacia ejemplos de mercados e instrumentos. El objetivo es desarrollar criterio propio a medida que se adquiere experiencia." },
    ],
    next: { label: "Ver transparencia", href: "/nosotros/transparencia/" },
  },
  "/nosotros/transparencia/": {
    title: "Transparencia",
    group: "Nosotros",
    description: "Consulta qué puedes esperar de los recursos educativos de Arkez Invest.",
    sections: [
      { title: "Alcance educativo", body: "Las páginas explican conceptos generales. Para evaluar una situación particular, considera tus objetivos y circunstancias y, cuando corresponda, consulta a un profesional autorizado en tu jurisdicción." },
      { title: "Ejemplos y referencias", body: "Los ejemplos ilustran conceptos. Para comparar productos específicos, consulta la documentación oficial del emisor y verifica su vigencia." },
    ],
    cards: [riskCard],
  },
  "/contacto/": {
    title: "Contacto",
    group: "Arkez Invest",
    description: "Consulta cómo está previsto el contacto con Arkez Invest y qué puedes explorar mientras revisamos esta primera versión.",
    sections: [
      { title: "Canales de contacto", body: "Los canales oficiales se habilitarán cuando estén verificados. Por ahora, esta vista previa ofrece únicamente información y recursos educativos." },
    ],
    next: { label: "Explorar los recursos", href: "/recursos/" },
  },
  "/legal/privacidad/": {
    title: "Privacidad",
    group: "Información del sitio",
    description: "Alcance de privacidad de esta vista previa de Arkez Invest.",
    sections: [
      { title: "Datos en esta versión", body: "El sitio carece de formularios, cuentas y herramientas de analítica. El operador del entorno de vista previa puede generar registros técnicos de acceso." },
      { title: "Antes de habilitar contacto", body: "La versión con contacto deberá identificar al responsable del tratamiento y explicar las finalidades, destinatarios, conservación y el canal para ejercer derechos aplicables." },
    ],
  },
  "/legal/terminos/": {
    title: "Términos de uso de la vista previa",
    group: "Información del sitio",
    description: "Condiciones de consulta para esta versión de evaluación del sitio.",
    sections: [
      { title: "Uso informativo", body: "Las páginas presentan información general de educación financiera. La vista previa permite revisar el contenido y la navegación antes de su publicación." },
      { title: "Decisiones de inversión", body: "Verifica los datos con las fuentes originales y valora tus circunstancias y el riesgo antes de invertir." },
    ],
  },
  "/legal/riesgos/": {
    title: "Riesgos de inversión",
    group: "Información del sitio",
    description: "Toda inversión implica riesgos, incluida la pérdida parcial o total del capital.",
    sections: [
      { title: "Mercado y liquidez", body: "El precio puede bajar y puede resultar difícil vender al precio o en el momento esperado." },
      { title: "Moneda, concentración y contraparte", body: "El tipo de cambio puede afectar el resultado. La exposición a pocas posiciones o a una única contraparte puede amplificar las pérdidas." },
      { title: "Activos digitales", body: "Además de la volatilidad, considera el riesgo operativo, la custodia, el protocolo y los cambios regulatorios que puedan afectar al instrumento." },
    ],
    next: contactLink,
  },
};
