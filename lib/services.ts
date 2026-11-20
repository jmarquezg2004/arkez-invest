import type { ContentSection, IconName } from "./content";

export const services = [
  {
    id: "educacion-financiera",
    title: "Educación financiera",
    cardTitle: "Educación financiera",
    description: "Comprende los conceptos que sustentan tus decisiones de ahorro, financiación e inversión.",
    body: "Formación para ordenar tus finanzas y entender instrumentos, costos y riesgos antes de decidir.",
    icon: "book",
    topics: [
      { title: "A quién se dirige", body: "Personas que quieren construir fundamentos y equipos que necesitan un lenguaje financiero común." },
      { title: "Qué puedes aprender", body: "Organizar ingresos y gastos, distinguir ahorro de inversión y comparar alternativas por objetivo, plazo, liquidez y costo." },
      { title: "Cómo trabajamos", body: "Partimos de tus objetivos y practicamos con casos como comparar dos opciones de financiación de igual plazo. Revisamos qué datos necesitas para justificar tu conclusión." },
    ],
    links: [
      { href: "/servicios/educacion-financiera/", label: "Explorar el enfoque de educación financiera" },
      { href: "/contacto/?servicio=educacion-financiera", label: "Solicitar información sobre educación financiera" },
    ],
  },
  {
    id: "analisis-de-mercados",
    title: "Análisis de mercados financieros",
    cardTitle: "Análisis de mercados",
    description: "Interpreta tendencias, indicadores y fuentes de información financiera.",
    body: "Formación para interpretar información económica, datos de mercado y características de un emisor a partir de fuentes verificables.",
    icon: "chart",
    topics: [
      { title: "A quién se dirige", body: "Personas y equipos que consultan noticias, informes o gráficos y necesitan distinguir el dato, la interpretación y los supuestos." },
      { title: "Qué puedes aprender", body: "El análisis fundamental examina el contexto económico y la información del emisor. El análisis técnico estudia series de precios y volumen. Aprenderás a formular preguntas distintas para cada método y a reconocer sus límites." },
      { title: "Cómo trabajamos", body: "Tomamos un indicador, verificamos quién lo publica y qué mide, y comparamos dos interpretaciones. Por ejemplo, contrastamos un cambio de precio con el volumen y el contexto. El ejercicio termina explicando qué información falta." },
    ],
    links: [
      { href: "/recursos/articulos/#lectura-de-mercados", label: "Leer cómo comparar análisis técnico y fundamental" },
      { href: "/contacto/?servicio=analisis-de-mercados", label: "Solicitar información sobre análisis de mercados" },
    ],
  },
  {
    id: "formacion-practica",
    title: "Formación práctica en inversiones",
    cardTitle: "Formación práctica",
    description: "Aplica conceptos y herramientas digitales con ejercicios y escenarios ilustrativos.",
    body: "Capacitación en inversiones para practicar la comparación de instrumentos y la gestión del riesgo financiero con datos de ejemplo.",
    icon: "layers",
    topics: [
      { title: "A quién se dirige", body: "Personas que ya conocen conceptos básicos y equipos que buscan practicar un proceso de análisis compartido." },
      { title: "Qué puedes aprender", body: "Preparar una matriz de comparación, contrastar escenarios y documentar por qué cambian tus conclusiones cuando modificas un supuesto." },
      { title: "Cómo trabajamos", body: "Construimos un caso con datos ficticios en una hoja de cálculo, revisamos costos y disponibilidad del dinero, y evaluamos el razonamiento detrás de la comparación." },
    ],
    links: [
      { href: "/recursos/guias/#comparar-escenarios", label: "Practicar con la guía de escenarios" },
      { href: "/contacto/?servicio=formacion-practica", label: "Solicitar información sobre formación práctica" },
    ],
  },
  {
    id: "consultoria-financiera",
    title: "Consultoría financiera",
    cardTitle: "Consultoría financiera",
    description: "Estructura preguntas, criterios y escenarios para decisiones de personas y empresas.",
    body: "Acompañamiento para delimitar una pregunta financiera, identificar la información relevante y comparar alternativas con criterios explícitos.",
    icon: "compass",
    topics: [
      { title: "A quién se dirige", body: "Personas que necesitan ordenar una decisión y empresas que buscan estructurar un análisis de liquidez, financiación o planificación." },
      { title: "Qué puedes aprender", body: "Priorizar variables, identificar restricciones, distinguir hechos de supuestos y explicar qué podría cambiar una conclusión." },
      { title: "Cómo trabajamos", body: "Delimitamos el objetivo en un diagnóstico, revisamos las fuentes y evaluamos escenarios. En un análisis de flujo de caja, por ejemplo, comparamos qué cambia si los cobros se desplazan frente a los vencimientos." },
    ],
    links: [
      { href: "/nosotros/transparencia/", label: "Consultar el alcance de la consultoría" },
      { href: "/contacto/?servicio=consultoria-financiera", label: "Solicitar información sobre consultoría financiera" },
    ],
  },
] satisfies readonly (ContentSection & { id: string; description: string; cardTitle: string; icon: IconName })[];
