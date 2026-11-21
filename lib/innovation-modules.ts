import type { Allocation } from "@/components/charts/financial-graphics";

export const hybridAssets = [
  { name: "Acciones", weight: 25, tone: "blue", note: "Participación en una empresa. Revisa concentración por emisor y sector." },
  { name: "ETF", weight: 20, tone: "violet", note: "Fondo cotizado. Revisa qué posee para detectar exposiciones repetidas con las acciones." },
  { name: "Bonos", weight: 30, tone: "steel", note: "Deuda de un emisor. Evalúa sensibilidad a tasas, calidad crediticia y vencimiento." },
  { name: "Activos digitales", weight: 15, tone: "gold", note: "Exposición a criptoactivos. Revisa volatilidad, custodia y condiciones de salida." },
  { name: "Activos tokenizados", weight: 10, tone: "green", note: "Derechos representados mediante tokens. Confirma el subyacente, el contrato y la redención." },
] as const satisfies readonly (Allocation & { note: string })[];

export const defiPaths = [
  { name: "Liquidez", destination: "Pool de liquidez", note: "El pool reúne activos para permitir intercambios. Compara la variación relativa de las reservas y cuánto cuesta retirar fondos." },
  { name: "Préstamos", destination: "Préstamo con garantía", note: "El contrato compara deuda y garantía. Una caída de la garantía puede provocar su liquidación según las reglas del protocolo." },
  { name: "Staking", destination: "Validación de red", note: "El staking nativo forma parte del consenso de algunas redes. Un proveedor puede reunir la participación y añadir condiciones de custodia, desbloqueo o penalización." },
] as const;

export const financeSeries = [
  { name: "Informe completo", readings: [100, 104, 101, 110, 108, 115], note: "Con las seis observaciones a la vista, el índice termina en 115 puntos y también presenta caídas intermedias." },
  { name: "Ventana corta", readings: [110, 108, 115], note: "La selección empieza en 110 y termina en 115. El cambio es menor que el de la serie completa porque parte de un punto distinto." },
  { name: "Escenario alternativo", readings: [100, 104, 101, 110, 108, 96], note: "Si el último dato simulado cae a 96, revisa si el patrón resiste. Un patrón observado puede desaparecer al cambiar un supuesto." },
] as const;

export const academyPath = [
  { level: "Bases", aim: "Identificar instrumentos y sus riesgos", label: "Guía para empezar a invertir", href: "/recursos/guias/primeros-pasos/" },
  { level: "Práctica", aim: "Comparar supuestos en una hoja editable", label: "Laboratorio de escenarios", href: "/recursos/guias/#comparar-escenarios" },
  { level: "Aplicación", aim: "Documentar una conclusión y sus límites", label: "Formación práctica en inversiones", href: "/servicios/formacion-practica/" },
] as const;

export const ecosystemPaths = [
  { step: "Comprender", aim: "Ordenar conceptos y riesgos", label: "Educación financiera", href: "/servicios/educacion-financiera/" },
  { step: "Investigar", aim: "Contrastar datos e indicadores", label: "Análisis de mercados", href: "/servicios/analisis-de-mercados/" },
  { step: "Practicar", aim: "Poner a prueba los supuestos", label: "Formación práctica", href: "/servicios/formacion-practica/" },
  { step: "Decidir", aim: "Estructurar alternativas en equipo", label: "Consultoría financiera", href: "/servicios/consultoria-financiera/" },
] as const;
