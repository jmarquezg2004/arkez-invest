import type { EditionSlug } from "./library";
import { serviceDetails } from "./service-details";
import { services } from "./services";
import worksheets from "./worksheets.json";
import { educationLink, firstGuideLink, serviceHref, siteDescription, type SiteLink } from "./navigation";

export type IconName = "book" | "layers" | "compass" | "shield" | "building" | "users" | "chart" | "file" | "message";

export type ContentCard = SiteLink & {
  description: string;
  icon: IconName;
};

type Topic = { title: string; body: string };
export type ContentSection = Topic & { id?: string; topics?: readonly Topic[]; edition?: EditionSlug; preview?: { href: string; alt: string; width: number; height: number }; links?: readonly SiteLink[] };
type Editorial = { updated: string; sources: readonly SiteLink[] };

export type ContentPage = {
  title: string;
  description: string;
  group: string;
  sections?: readonly ContentSection[];
  cards?: readonly ContentCard[];
  faq?: readonly ContentSection[];
  next?: SiteLink;
  editorial?: Editorial;
};

export const serviceCards: readonly ContentCard[] = services.map(({ id, cardTitle, description, icon }) => ({
  href: serviceHref(id),
  label: cardTitle,
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

const dedicatedServices = Object.fromEntries(services.filter(({ id }) => id !== "educacion-financiera").map((service) => {
  const details = serviceDetails[service.id];
  return [serviceHref(service.id), {
    title: service.id === "analisis-de-mercados" ? "Aprende a analizar los mercados" : service.title,
    group: "Servicios",
    description: service.id === "analisis-de-mercados" ? "Aprende a interpretar gráficos, noticias y datos financieros y a verificar sus fuentes." : service.body,
    sections: [
      { title: "Qué ofrecemos", body: service.description },
      ...service.topics,
      ...details.sections,
      { title: "Recurso para practicar", body: "Consulta un ejemplo o una herramienta que puedas usar para explorar este tema.", links: [service.resource] },
    ],
    faq: details.faq,
    next: { href: `/contacto/?servicio=${service.id}`, label: `Solicitar información sobre ${service.cardTitle.toLowerCase()}` },
  }];
})) satisfies Record<string, ContentPage>;

export const pages: Readonly<Record<string, ContentPage>> = {
  ...dedicatedServices,
  "/herramientas/": {
    title: "Herramientas financieras gratuitas",
    group: "Arkez Invest",
    description: "Prueba una calculadora de ahorro y ejercicios interactivos de mercados, riesgo y diversificación con datos de ejemplo.",
  },
  "/herramientas/interes-compuesto/": {
    title: "Calculadora de interés compuesto",
    group: "Herramientas",
    description: "Descubre cómo pueden crecer tus ahorros con el tiempo.",
    sections: [
      { title: "¿Qué es el interés compuesto?", body: "Es el cambio que se calcula sobre lo que ya tienes, incluidos los intereses acumulados. Por ejemplo, 100 al 10 % anual pasan a 110 el primer año y a 121 el segundo, sin aportes ni costos." },
      { title: "¿Qué implica la frecuencia de capitalización?", body: "La tasa anual que introduces es nominal. La calculadora la divide según la frecuencia elegida y obtiene una tasa mensual equivalente para incluir los aportes. A una tasa nominal de 12 % con capitalización mensual, corresponde 1 % por mes." },
    ],
  },
  "/actualidad/": {
    title: "Actualidad financiera y económica",
    group: "Arkez Invest",
    description: "Encuentra fuentes para seguir la economía, la tecnología financiera y las oportunidades de aprendizaje.",
  },
  "/ecosistema/": {
    title: "Directorio financiero y tecnológico",
    group: "Arkez Invest",
    description: "Explora sitios oficiales para informarte sobre mercados, activos digitales, tecnología financiera, formación y eventos.",
  },
  "/servicios/": {
    title: "Servicios de formación y consultoría financiera",
    group: "Arkez Invest",
    description: "Encuentra la formación que te ayude a empezar a invertir, entender los mercados u organizar las finanzas de tu empresa.",
    sections: services.filter(({ id }) => id === "formacion-practica" || id === "consultoria-financiera").map(({ id, title, body, cardTitle }) => ({
      id, title, body, links: [{ href: serviceHref(id), label: `Ver servicio de ${cardTitle.toLowerCase()}` }],
    })),
    cards: [methodologyCard],
  },
  "/servicios/educacion-financiera/": {
    title: "Aprende a invertir desde cero",
    group: "Servicios",
    description: "Entiende qué opciones de inversión tienes, cuánto cuestan y qué riesgos debes revisar antes de decidir.",
    sections: [
      { title: "Fundamentos de inversión", body: "Explora la relación entre objetivos, horizonte, liquidez y tolerancia a pérdidas. Aprende a distinguir una explicación educativa de una recomendación personalizada." },
      { title: "Cómo funcionan los instrumentos", body: "Conoce las diferencias entre acciones, fondos, ETF y activos digitales. Cada instrumento tiene condiciones, costos y riesgos propios." },
      { title: "Cómo leer la información", body: "Usa herramientas digitales para comparar fuentes, verificar su fecha y distinguir datos, opiniones y supuestos." },
      { title: "A quién está dirigida", body: "Personas que empiezan a organizar sus finanzas y equipos que quieren comprender conceptos financieros comunes. Cuéntanos qué decisiones quieres practicar y cuál es tu punto de partida." },
      { title: "Qué aprenderás en la formación", body: "Practica cómo organizar un presupuesto, distinguir ahorro de inversión y relacionar cada decisión con su objetivo y plazo. Si buscas cursos de educación financiera, puedes consultar qué contenidos responden a tus necesidades." },
      ...serviceDetails["educacion-financiera"].sections,
      { title: "Metodología y ejemplo práctico", body: "Tras el diagnóstico, trabajamos con ejercicios y revisamos el aprendizaje. Por ejemplo, para comparar opciones de financiación anotamos el importe total, las comisiones y el calendario de pagos.", links: [{ href: "/servicios/metodologia/", label: "Conocer los cuatro pasos de la metodología" }, firstGuideLink] },
    ],
    faq: serviceDetails["educacion-financiera"].faq,
    next: { href: "/contacto/?servicio=educacion-financiera", label: "Solicitar información sobre educación financiera" },
  },
  "/servicios/metodologia/": {
    title: "Nuestra metodología de formación financiera",
    group: "Servicios",
    description: "Conectamos conceptos financieros, análisis de escenarios y herramientas digitales para ejercitar la toma de decisiones.",
    sections: methodologySteps,
    next: { label: "Ver guías prácticas", href: guidesCard.href },
  },
  "/para-quien/": {
    title: "Formación financiera para personas y empresas",
    group: "Arkez Invest",
    description: "Formación y consultoría financiera para personas y empresas que quieren desarrollar sus capacidades de análisis.",
    sections: [
      { title: "Para decidir sobre tus finanzas", body: "Si buscas ordenar ingresos, gastos o metas de inversión, el enfoque para personas parte de tus objetivos, plazos y capacidad de asumir riesgos." },
      { title: "Para planificar con tu equipo", body: "Si necesitas estudiar liquidez o financiación, el enfoque para empresas parte de los flujos de caja y los supuestos que influyen en las decisiones del equipo." },
    ],
    cards: [personsCard, businessCard],
  },
  "/para-quien/personas/": {
    title: "Formación en finanzas personales",
    group: "Para quién",
    description: "Desarrolla habilidades para entender tus finanzas, evaluar información y comparar alternativas según tus objetivos.",
    sections: [
      { title: "Si estás empezando", body: "Diferencia ahorro, inversión y dinero para gastos próximos. Establecer esa distinción te ayuda a entender qué dinero puedes exponer a pérdidas y durante cuánto tiempo." },
      { title: "Si ya inviertes", body: "Revisa si tu exposición se concentra en un solo mercado, sector, emisor o moneda. Comprueba también los costos y las condiciones para retirar el dinero." },
      { title: "Un ejercicio para priorizar objetivos", body: "Distingue los gastos próximos de una meta de largo plazo y revisa qué importe puedes reservar periódicamente. Si las fechas o los ingresos cambian, compara cómo se ajusta cada meta.", links: [educationLink, firstGuideLink] },
    ],
    next: { href: "/contacto/?servicio=educacion-financiera", label: "Consultar sobre formación para personas" },
  },
  "/para-quien/empresas/": {
    title: "Finanzas para tu empresa",
    group: "Para quién",
    description: "Aprende a organizar ingresos y gastos, anticipar faltantes de caja y planear con tu equipo.",
    sections: [
      { title: "Liquidez operativa", body: "Identifica cuándo vence cada obligación y qué recursos necesitas mantener disponibles para operar." },
      { title: "Horizonte y escenarios", body: "Distingue los recursos de corto plazo de aquellos con un horizonte mayor. Examina el impacto de cambios en ingresos, costos o tipo de cambio." },
      { title: "Una práctica para tu equipo", body: "Usa un calendario de cobros y pagos ficticios para identificar una brecha de caja. Contrasta el escenario base con un retraso de cobro y registra qué decisión cambiaría.", links: [{ href: "/servicios/consultoria-financiera/", label: "Ver consultoría y planificación" }, { href: "/servicios/metodologia/", label: "Conocer la metodología" }] },
    ],
    next: { href: "/contacto/?servicio=finanzas-empresariales", label: "Consultar sobre formación para empresas" },
  },
  "/recursos/": {
    title: "Recursos de aprendizaje financiero",
    group: "Arkez Invest",
    description: "Busca guías, plantillas, casos prácticos y artículos. Puedes leer los recursos en la web o guardar los archivos para practicar.",
    cards: [guidesCard, articlesCard, {
      label: "Preguntas frecuentes",
      href: "/recursos/preguntas-frecuentes/",
      description: "Conoce el alcance de los contenidos y encuentra un buen punto de partida.",
      icon: "message",
    }],
  },
  "/recursos/guias/": {
    title: "Guías prácticas de análisis financiero",
    group: "Recursos",
    description: "Ejercicios y preguntas para revisar fuentes, comparar escenarios y evaluar información financiera.",
    sections: [
      { id: "comparar-escenarios", title: "Cómo comparar dos escenarios financieros", body: "Abre el Laboratorio financiero y revisa las hojas Instrucciones, Presupuesto, Escenarios, Inversiones, Riesgo y Dashboard. En Escenarios, usa la misma moneda y período, y cambia una sola variable por alternativa. Las celdas doradas contienen ejemplos ficticios. Las celdas azules se reservan para tus datos. El Dashboard tiene un selector para alternar entre ambos conjuntos.", links: [{ href: "/recursos/archivos/laboratorio-financiero.xlsx", label: "Abrir el Laboratorio financiero (XLSX)" }],
        preview: { href: "/recursos/portadas/vista-dashboard.webp", alt: "Dashboard del libro con saldos por mes, comparación de escenarios y pesos por posición del ejemplo ficticio.", width: 970, height: 670 },
      },
      { id: "liquidez-operativa", edition: "liquidez-operativa", title: worksheets["liquidez-operativa"].title, body: worksheets["liquidez-operativa"].intro,
        topics: worksheets["liquidez-operativa"].topics, links: [
          { href: "/recursos/archivos/liquidez-operativa.pdf", label: "Ver el caso de liquidez operativa (PDF)" },
          { href: "/recursos/archivos/laboratorio-financiero.xlsx", label: "Abrir el libro de trabajo de escenarios (XLSX)" },
        ] },
      { id: "revisar-fuentes", title: "Lista de comprobación para revisar fuentes", body: "Registra quién publica el dato, su fecha, la unidad de medida y cómo se calculó. Si dos fuentes difieren, comprueba que describen el mismo período y concepto antes de elegir cómo usar sus datos." },
    ],
    cards: [startingCard, riskCard],
  },
  "/recursos/guias/primeros-pasos/": {
    title: "Primeros pasos para invertir",
    group: "Guías",
    description: "Una guía de formación con cinco preguntas para ordenar tu decisión antes de comparar instrumentos.",
    editorial: { updated: "2026-11-20", sources: [
      { label: "Investor.gov: horizonte y asignación de activos", href: "https://www.investor.gov/introduction-investing/getting-started/asset-allocation" },
      { label: "Investor.gov: efecto de las comisiones y gastos", href: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated" },
    ] },
    sections: [
      { title: "¿Cuál es tu objetivo?", body: "Expresa para qué necesitas el dinero. Un objetivo concreto te ayuda a comparar alternativas con el mismo propósito." },
      { title: "¿Cuándo lo necesitarás?", body: "Distingue entre una fecha definida y un horizonte flexible. Revisa también cuánto tardarías en disponer del dinero." },
      { title: "¿Qué pérdida podrías asumir?", body: "Piensa cómo afectaría una caída a tu objetivo y a tus otros gastos. Separa tu capacidad financiera de tu comodidad con la volatilidad." },
      { title: "¿Cómo funciona y cuánto cuesta?", body: "Revisa la documentación del instrumento y las comisiones, impuestos u otros costos aplicables. Identifica de qué depende su resultado." },
      { title: "¿Qué falta verificar?", body: "Anota la fuente consultada, sus posibles conflictos de interés y lo que desconoces antes de tomar una decisión." },
      { title: "Ejemplo: un objetivo con fecha fija", edition: "primeros-pasos-para-invertir", body: "Si necesitas pagar una matrícula en seis meses, anota el importe y la fecha. Compara cuándo estaría disponible el dinero, cuánto cuesta retirarlo y qué ocurriría si el valor baja justo antes del pago. Registra la respuesta antes de pasar a otro instrumento.", links: [{ href: "/recursos/archivos/primeros-pasos-para-invertir.pdf", label: "Ver la lista de comprobación para invertir (PDF)" }] },
    ],
    next: { label: "Revisar los riesgos", href: riskCard.href },
  },
  "/recursos/articulos/": {
    title: "Artículos sobre mercados financieros y riesgo",
    group: "Recursos",
    description: "Explicaciones en español para interpretar los mercados, entender el riesgo y aplicar conceptos financieros.",
    sections: [
      { id: "lectura-de-mercados", edition: "lectura-de-mercados", title: "Análisis técnico y fundamental: qué pregunta responde cada uno", body: "El fundamental examina factores como ventas, deuda y contexto económico. El técnico describe el comportamiento del precio y el volumen. Ante una caída de precio, puedes revisar si cambió la situación del emisor y, por separado, si el movimiento coincide con un cambio de volumen. Ninguna de estas observaciones determina por sí sola el precio siguiente.", topics: worksheets["lectura-de-mercados"].topics, links: [{ href: "/recursos/archivos/lectura-de-mercados.pdf", label: "Ver el caso guiado de análisis de mercados (PDF)" }] },
      { id: "inflacion", title: "Qué es la inflación y por qué cambia las comparaciones", body: "La inflación refleja un aumento general de los precios. Si el costo de lo que quieres comprar sube, necesitarás más dinero para la misma compra. Al comparar cantidades de períodos distintos, revisa qué índice estás utilizando y qué precios representa.", links: [{ href: "https://www.banrep.gov.co/es/glosario/inflacion-consumidor", label: "Banco de la República: inflación al consumidor" }] },
    ],
    cards: [diversificationCard],
  },
  "/recursos/articulos/que-es-diversificar/": {
    title: "Qué es diversificar una inversión",
    group: "Artículos",
    description: "Diversificar consiste en repartir la exposición para depender menos de un único resultado. Este artículo explica cómo analizar esa exposición.",
    editorial: { updated: "2026-11-20", sources: [
      { label: "Investor.gov: diversificación de inversiones", href: "https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/diversify-your-investments" },
      { label: "Investor.gov: asignación de activos y diversificación", href: "https://www.investor.gov/introduction-investing/getting-started/asset-allocation" },
    ] },
    sections: [
      { title: "Ejemplo de concentración oculta", body: "Imagina dos fondos con las mismas empresas principales. Si estas representan buena parte de ambos fondos, comprar los dos puede dejarte expuesto a los mismos movimientos. Compara las posiciones y sus pesos para detectar el solapamiento." },
      { title: "Revisa más de una dimensión", body: "Sectores, países, monedas, emisores y tipos de instrumento son dimensiones diferentes. Algunas exposiciones se pueden mover en la misma dirección ante un evento." },
      { title: "La pérdida sigue siendo posible", body: "Una cartera diversificada puede perder valor. La diversificación ayuda a gestionar exposición y concentración. Su efecto depende de los activos y del escenario." },
    ],
    next: { label: "Explorar la guía de inicio", href: firstGuideLink.href },
  },
  "/recursos/preguntas-frecuentes/": {
    title: "Preguntas frecuentes sobre formación y consultoría financiera",
    group: "Recursos",
    description: "Respuestas sobre la formación, la consultoría y el uso de los recursos de Arkez Invest.",
    faq: [
      { title: "¿Por dónde empiezo?", body: "La guía Primeros pasos para invertir reúne cinco preguntas sobre objetivos, plazos, pérdidas, costos y fuentes." },
      { title: "¿El contenido es una recomendación de inversión?", body: "Los contenidos de este sitio son educativos y generales. Cada decisión depende de las circunstancias, objetivos y riesgos de quien la toma." },
      { title: "¿Puedo abrir una cuenta desde el sitio?", body: "La actividad de Arkez Invest se centra en educación, formación y consultoría. La apertura de cuentas, la custodia de activos y la ejecución de operaciones quedan fuera de su actividad." },
      { title: "¿Necesito experiencia previa?", body: "La formación puede partir de conceptos básicos. Indica qué temas has estudiado y qué decisión quieres entender para orientar la consulta." },
      { title: "¿En qué se diferencia la formación de la consultoría?", body: "La formación desarrolla habilidades mediante ejercicios. La consultoría estructura una pregunta y un análisis de alternativas a partir de un objetivo concreto." },
      { title: "¿Puedo enviar documentos o datos financieros?", body: "Utiliza los datos de ejemplo para probar el formulario. La demostración transmite una prueba técnica y deja tu nombre, correo y mensaje en el navegador." },
    ],
    next: firstGuideLink,
  },
  "/nosotros/": {
    title: "Sobre Arkez Invest",
    group: "Arkez Invest",
    description: siteDescription,
    sections: [
      { title: "Identidad institucional", body: "Trabajamos con personas y equipos que quieren comprender sus decisiones financieras. La educación aporta conceptos, la formación los pone en práctica y la consultoría estructura el análisis de alternativas." },
      { title: "Cómo conectamos formación y tecnología", body: "Usamos herramientas digitales para organizar fuentes y comparar escenarios. El diagnóstico y la evaluación permiten revisar qué habilidades se aplicaron y qué queda por practicar.", links: [{ href: "/servicios/metodologia/", label: "Conocer la metodología institucional" }, { href: "/servicios/", label: "Consultar las áreas de servicio" }] },
    ],
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
      { title: "Funciones que reúne nuestro trabajo", body: "La formación organiza contenidos y ejercicios. El análisis selecciona fuentes y variables. La consultoría define preguntas y criterios de comparación para cada objetivo." },
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
      { title: "Responsabilidad editorial", body: "Arkez Invest es responsable de los contenidos del sitio. Las guías y artículos individuales identifican su revisión editorial y sus fuentes." },
    ],
    cards: [riskCard],
  },
  "/contacto/": {
    title: "Contacto para formación y consultoría financiera",
    group: "Arkez Invest",
    description: "Información de contacto para consultas sobre educación, formación y consultoría financiera.",
    sections: [
      { title: "Qué incluir en una consulta", body: "Indica qué servicio te interesa, si la consulta es para ti o para un equipo y qué objetivo te gustaría trabajar. Evita adjuntar documentos o incluir credenciales o datos de terceros.", links: [{ href: "/legal/privacidad/", label: "Consultar la privacidad de la vista previa" }] },
    ],

  },
  "/legal/privacidad/": {
    title: "Privacidad",
    group: "Información del sitio",
    description: "Información sobre el manejo de datos durante la revisión de este sitio informativo de Arkez Invest.",
    sections: [
      { title: "Datos en esta versión", body: "El nombre, correo y mensaje de prueba permanecen en el navegador. El servidor local recibe una prueba técnica de un solo uso y un indicador antispam, que procesa en memoria. El sitio carece de cuentas y analítica." },
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
    title: "Gestión del riesgo financiero en inversiones",
    group: "Información del sitio",
    description: "Conceptos para identificar y evaluar riesgos de inversión, incluida la posibilidad de perder parte o todo el capital.",
    sections: [
      { title: "Mercado y liquidez", body: "El precio puede bajar y puede resultar difícil vender al precio o en el momento esperado." },
      { title: "Moneda, concentración y contraparte", body: "El tipo de cambio puede afectar el resultado. La exposición a pocas posiciones o a una única contraparte puede amplificar las pérdidas." },
      { title: "Activos digitales", body: "Además de la volatilidad, considera el riesgo operativo, la custodia, el protocolo y los cambios regulatorios que puedan afectar al instrumento." },
      { title: "Cómo plantear un escenario de riesgo", body: "Identifica qué variable podría cambiar, como un plazo de venta o el tipo de cambio. Estima cómo afectaría el acceso al dinero y compara el resultado con tu objetivo.", links: [{ href: "/recursos/guias/#comparar-escenarios", label: "Practicar con la guía de escenarios" }, { href: "https://www.investor.gov/introduction-investing/investing-basics/what-risk", label: "Investor.gov: conceptos de riesgo de inversión" }] },
    ],

  },
};
