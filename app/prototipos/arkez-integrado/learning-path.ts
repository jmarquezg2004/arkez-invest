const resources = {
  basics: { title: "Primeros pasos", path: "/recursos/guias/primeros-pasos/", format: "Guía", task: "Identifica el objetivo, el plazo y los costos en el ejemplo." },
  growth: { title: "Calculadora de interés compuesto", path: "/herramientas/interes-compuesto/", format: "Simulador", task: "Compara el mismo aporte mensual con dos plazos ilustrativos." },
  diversification: { title: "Qué es diversificar", path: "/recursos/articulos/que-es-diversificar/", format: "Guía", task: "Identifica qué exposiciones comparten los activos del ejemplo." },
  tracker: { title: "Panel de inversiones", path: "/#nx-lab-2", format: "Simulador", task: "Alterna entre meses y plataformas del registro ficticio para detectar concentraciones." },
  property: { title: "Evaluador inmobiliario", path: "/#nx-lab-0", format: "Simulador", task: "Cambia los gastos y compara ambos escenarios en pesos de hoy." },
  scenarios: { title: "Cómo comparar dos escenarios", path: "/recursos/guias/#comparar-escenarios", format: "Guía", task: "Mantén el mismo plazo y cambia una sola variable a la vez." },
  markets: { title: "Análisis técnico y fundamental", path: "/recursos/articulos/#lectura-de-mercados", format: "Guía", task: "Separa la información sobre precios y volumen de los datos del negocio." },
  oddModel: { title: "Modelo de negocio de ODDITY", path: "/research/oddity/modelo/", format: "Caso empresarial", task: "Sigue el recorrido desde que un cliente descubre una marca hasta que paga." },
  oddReport: { title: "Informe de ODDITY", path: "/research/oddity/informe/", format: "Demostración visual", task: "Cambia de ingresos a beneficio bruto y observa cómo se mueven las dos cifras." },
  nuModel: { title: "Modelo de negocio de Nubank", path: "/explore/nubank/modelo/", format: "Caso empresarial", task: "Identifica qué papel tienen el crédito y los servicios en sus ingresos." },
  nuChart: { title: "Gráficos financieros de Nubank", path: "/explore/nubank/graficos/", format: "Demostración visual", task: "Identifica el periodo y la unidad antes de comparar las cifras." },
  ai: { title: "Cadena de valor de la IA", path: "/explore/ecosistema-ia/", format: "Demostración visual", task: "Selecciona una etapa y explica qué aporta a la que sigue." },
  network: { title: "Mapa de infraestructura de IA", path: "/#nx-lab-1", format: "Demostración visual", task: "Elige un nodo y comprueba en su fuente qué relación describe." },
  cash: { title: "Caso de liquidez operativa", path: "/recursos/guias/#liquidez-operativa", format: "Caso empresarial", task: "Ubica cuándo entran los cobros y cuándo vencen los pagos en el caso." },
} as const;

type ResourceKey = keyof typeof resources;
type Topic = { label: string; title: string; lessons: readonly [ResourceKey, ResourceKey, ResourceKey] };
const topics = {
  ahorro: { label: "Ahorro y tiempo", title: "Entiende qué cambia cuando ajustas los plazos", lessons: ["basics", "growth", "scenarios"] },
  riesgo: { label: "Riesgo y diversificación", title: "Aprende a reconocer la concentración", lessons: ["diversification", "tracker", "scenarios"] },
  consumo: { label: "Marcas y comercio digital", title: "Entiende de dónde sale el dinero de ODDITY", lessons: ["oddModel", "oddReport", "nuModel"] },
  banca: { label: "Banca digital", title: "Entiende cómo gana dinero Nubank", lessons: ["nuModel", "nuChart", "oddModel"] },
  inmueble: { label: "Inmuebles", title: "Compara dos escenarios inmobiliarios", lessons: ["property", "scenarios", "basics"] },
  mercados: { label: "Acciones y lectura de mercados", title: "Aprende a leer cifras y gráficos de mercado", lessons: ["markets", "nuChart", "diversification"] },
  registro: { label: "Registro y seguimiento", title: "Ordena y compara un registro ficticio", lessons: ["tracker", "diversification", "scenarios"] },
  ia: { label: "Inteligencia artificial e infraestructura", title: "Sigue la cadena de valor de la IA", lessons: ["ai", "network", "scenarios"] },
  liquidez: { label: "Flujo de caja y liquidez", title: "Distingue entre vender y tener efectivo disponible", lessons: ["cash", "scenarios", "growth"] },
} as const satisfies Record<string, Topic>;

type TopicKey = keyof typeof topics;
const goalTopics = {
  fundamentos: ["ahorro", "riesgo"],
  empresa: ["consumo", "banca"],
  practica: ["mercados", "inmueble", "registro"],
  equipo: ["liquidez", "ia"],
} as const satisfies Record<string, readonly TopicKey[]>;

type Goal = keyof typeof goalTopics;
const businessFocus = {
  ingresos: "Empieza por quién paga, qué compra y cómo entra el dinero.",
  relaciones: "Distingue cliente, proveedor y socio. Anota qué relación puedes confirmar en las fuentes del caso.",
  riesgos: "Identifica qué costo, margen o supuesto merece una segunda lectura.",
} as const;

export type Answers = Partial<{
  goal: Goal; level: "inicio" | "bases" | "ejercicio"; topic: TopicKey;
  time: "hoy" | "semanas"; format: "lectura" | "visual" | "practica"; focus: keyof typeof businessFocus;
}>;
type Question = { id: keyof Answers; title: string; options: readonly (readonly [string, string])[] };

export function learningQuestions(answers: Answers): Question[] {
  const keys = goalTopics[answers.goal ?? "fundamentos"];
  const questions: Question[] = [
    { id: "goal", title: "¿Qué quieres entender o resolver primero?", options: [
      ["fundamentos", "Entender los fundamentos y ordenar mis ideas"],
      ["empresa", "Entender cómo funciona una empresa"],
      ["practica", "Practicar con un simulador o datos de mercado"],
      ["equipo", "Aplicar lo aprendido en un negocio o equipo"],
    ] },
    { id: "level", title: "¿Qué tan familiar te sientes con estos temas?", options: [
      ["inicio", "Estoy empezando desde cero"], ["bases", "Conozco algunos conceptos"], ["ejercicio", "Ya he hecho ejercicios y quiero profundizar"],
    ] },
    { id: "topic", title: "¿Qué tema te da más curiosidad?", options: keys.map((key) => [key, topics[key].label]) },
    { id: "time", title: "¿Cuánto tiempo quieres dedicarle?", options: [
      ["hoy", "Resolver una duda hoy"], ["semanas", "Aprender en varias sesiones"],
    ] },
    { id: "format", title: "¿Cómo prefieres aprender?", options: [
      ["lectura", "Leer una guía o un caso"], ["visual", "Explorar gráficos o diagramas"], ["practica", "Practicar con un ejercicio o simulador"],
    ] },
  ];
  if (answers.goal === "empresa") questions.push({ id: "focus", title: "¿Qué parte del negocio quieres entender primero?", options: [
    ["ingresos", "Cómo gana dinero"], ["relaciones", "Quiénes son sus clientes, socios y proveedores"], ["riesgos", "Qué riesgos enfrenta"],
  ] });
  return questions;
}

export function learningPath(answers: Answers) {
  if (!learningQuestions(answers).every(({ id, options }) => options.some(([value]) => value === answers[id])) || !answers.topic) return null;
  const topic = topics[answers.topic];
  const format = answers.format === "visual" ? "Demostración visual" : answers.format === "practica" ? "Simulador" : "Guía";
  const steps = topic.lessons.map((key) => resources[key]);
  const byFormat = steps.find((step) => step.format === format);
  const first = answers.goal === "empresa" && answers.focus === "riesgos" ? steps[1]
    : answers.goal === "empresa" && answers.focus === "relaciones" ? steps[0]
    : byFormat ?? steps[0];
  const level = answers.goal === "equipo" ? "Expande" : answers.level === "inicio" ? "Empieza" : "Aplica";
  return {
    title: topic.title,
    level,
    session: answers.time === "hoy" ? "Una sesión breve" : "Tres sesiones a tu ritmo",
    prompt: answers.level === "inicio" ? "Empieza por describir con tus palabras lo que ves." : answers.level === "ejercicio" ? "Anota qué supuesto cambiarías y cómo comprobarías el resultado." : "Compara dos ejemplos y explica qué cambia entre ellos.",
    focus: answers.goal === "empresa" && answers.focus ? businessFocus[answers.focus] : null,
    first,
    next: steps.filter((step) => step !== first),
  } as const;
}
