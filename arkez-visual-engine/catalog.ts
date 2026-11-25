export const categories = [
  ["tecnologia", "Tecnología e inteligencia artificial"],
  ["finanzas", "Banca digital y servicios financieros"],
  ["ciberseguridad", "Ciberseguridad"],
  ["energia", "Energía e infraestructura"],
  ["salud", "Salud y biotecnología"],
  ["consumo", "Consumo y comercio"],
  ["fondos", "ETF y fondos"],
  ["blockchain", "Blockchain y activos digitales"],
  ["ecosistemas", "Ecosistemas y cadenas de valor"],
] as const;

export type Category = (typeof categories)[number][0];
export type Art = "chip" | "bank" | "security" | "energy" | "report" | "globe" | "study" | "chain";
export type CatalogItem = { id: string; name: string; ticker?: string; category: Category; topic: string; summary: string; art: Art; palette: string; href?: string };

export const catalog: CatalogItem[] = [
  { id: "nvidia", name: "NVIDIA", ticker: "NVDA", category: "tecnologia", topic: "Chips · Centros de datos", summary: "Una entrada a la función de los aceleradores y al costo de ejecutar modelos de IA.", art: "chip", palette: "green" },
  { id: "palantir", name: "Palantir", ticker: "PLTR", category: "tecnologia", topic: "Datos · Software empresarial", summary: "Una guía para distinguir una plataforma de datos de los modelos que puede integrar.", art: "chain", palette: "blue" },
  { id: "amd", name: "AMD", ticker: "AMD", category: "tecnologia", topic: "Diseño de chips · CPU y GPU", summary: "Explora la diferencia entre diseñar una arquitectura y fabricar el chip.", art: "chip", palette: "orange" },
  { id: "nube-ia", name: "Economía de la nube", category: "tecnologia", topic: "Cómputo · Costos de inferencia", summary: "Relaciona el volumen de uso con el costo de servir un modelo.", art: "globe", palette: "blue" },
  { id: "nubank", name: "Nubank", ticker: "NU", category: "finanzas", topic: "Banca digital · América Latina", summary: "Estudia sus resultados de 2024, presencia regional y modelo de negocio en seis recursos.", art: "bank", palette: "purple", href: "nubank/" },
  { id: "sofi", name: "SoFi", ticker: "SOFI", category: "finanzas", topic: "Crédito · Servicios financieros", summary: "Preguntas para comparar ingresos por crédito, depósitos y comisiones.", art: "study", palette: "blue" },
  { id: "mercadolibre", name: "Mercado Libre", ticker: "MELI", category: "finanzas", topic: "Pagos · Comercio", summary: "Qué cambia cuando un mercado digital añade medios de pago y crédito.", art: "report", palette: "gold" },
  { id: "creditos", name: "Ciclo del crédito", category: "finanzas", topic: "Riesgo · Margen financiero", summary: "Identifica qué pasa entre originar un préstamo, financiarlo y cubrir las pérdidas esperadas.", art: "report", palette: "blue" },
  { id: "crowdstrike", name: "CrowdStrike", ticker: "CRWD", category: "ciberseguridad", topic: "Protección de dispositivos", summary: "Identifica qué problema resuelve una plataforma de protección de dispositivos.", art: "security", palette: "red" },
  { id: "zscaler", name: "Zscaler", ticker: "ZS", category: "ciberseguridad", topic: "Seguridad en la nube", summary: "Qué significa controlar el acceso a aplicaciones en lugar de confiar en la red.", art: "security", palette: "blue" },
  { id: "palo-alto", name: "Palo Alto Networks", ticker: "PANW", category: "ciberseguridad", topic: "Seguridad de redes", summary: "Distingue seguridad de red, protección en la nube y operaciones de seguridad.", art: "security", palette: "orange" },
  { id: "riesgo-digital", name: "Riesgo operativo", category: "ciberseguridad", topic: "Continuidad · Terceros", summary: "Una lectura empresarial sobre continuidad operativa y dependencia de proveedores.", art: "study", palette: "blue" },
  { id: "red-electrica", name: "Red eléctrica", category: "energia", topic: "Capacidad · Centros de datos", summary: "Relaciona generación, transmisión y demanda eléctrica de los centros de datos.", art: "energy", palette: "gold" },
  { id: "biotecnologia", name: "Biotecnología", category: "salud", topic: "Investigación · Ensayos", summary: "Aprende por qué el calendario de ensayos y el flujo de caja importan en este sector.", art: "report", palette: "blue" },
  { id: "comercio", name: "Economía del comercio", category: "consumo", topic: "Logística · Márgenes", summary: "Compara margen bruto, logística y costo de adquisición de clientes.", art: "globe", palette: "orange" },
  { id: "etf", name: "Anatomía de un ETF", category: "fondos", topic: "Índices · Comisiones", summary: "Consulta qué replican estos fondos y qué mirar en gastos y concentración.", art: "study", palette: "blue" },
  { id: "blockchain", name: "Redes y tokenización", category: "blockchain", topic: "Custodia · Infraestructura", summary: "Separa la función de la red de la exposición al precio de un activo.", art: "chip", palette: "blue" },
  { id: "cadena-ia", name: "Cadena de valor de la IA", category: "ecosistemas", topic: "Energía · Chips · Nube · Software", summary: "Recorre siete etapas y descubre qué aporta cada una al producto final.", art: "chain", palette: "blue", href: "ecosistema-ia/" },
];
