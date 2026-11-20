import type { ContentSection } from "./content";

type ServiceDetails = { sections: readonly ContentSection[]; faq: readonly ContentSection[] };

export const serviceDetails = {
  "educacion-financiera": {
    sections: [
      { title: "Beneficios de la formación", body: "Construye un vocabulario para conversar sobre costos, plazos y riesgo. Practica cómo documentar una decisión y distinguir qué información necesitas verificar." },
    ],
    faq: [
      { title: "¿Necesito saber de inversiones para empezar?", body: "El diagnóstico permite partir de situaciones cotidianas como organizar gastos, comparar comisiones o distinguir entre ahorro e inversión." },
      { title: "¿Debo compartir mis estados de cuenta?", body: "Los ejercicios pueden hacerse con datos ficticios y fuentes públicas. Evita enviar documentos financieros o de identidad por el formulario." },
    ],
  },
  "analisis-de-mercados": {
    sections: [
      { title: "Beneficios del análisis de mercados", body: "Podrás explicar de dónde sale un dato, qué período representa y qué observaciones respaldan una interpretación. También podrás identificar qué información falta antes de sacar conclusiones." },
      { title: "Contenidos de trabajo", body: "Lectura de precio y volumen, comparación de períodos, contexto de indicadores y fuentes del emisor. El caso de la biblioteca muestra cómo separar movimientos observados e hipótesis." },
    ],
    faq: [
      { title: "¿Cuál es la diferencia entre el análisis técnico y el fundamental?", body: "El técnico estudia el comportamiento de precio y volumen. El fundamental revisa información económica y del emisor. Cada enfoque plantea preguntas distintas y sus observaciones pueden complementarse." },
      { title: "¿El análisis incluye señales de compra o venta?", body: "La formación se centra en interpretar datos y contrastar hipótesis. Las actividades son educativas y no incluyen señales de negociación." },
    ],
  },
  "formacion-practica": {
    sections: [
      { title: "Beneficios de la práctica guiada", body: "Aprende a ordenar variables en una matriz, justificar una comparación y localizar el supuesto que más altera tu conclusión." },
      { title: "Contenidos de trabajo", body: "Definición del objetivo, tabla de costos y plazos, escenarios base y alternativo y registro de supuestos. Usamos cifras ficticias para practicar con la plantilla editable." },
    ],
    faq: [
      { title: "¿Puedo hacer los ejercicios sin abrir una cuenta?", body: "Sí. Los ejercicios usan tablas y escenarios ficticios. Puedes trabajar con una hoja de cálculo o transcribir las variables en papel." },
      { title: "¿Cómo se evalúa el aprendizaje?", body: "Revisamos si la comparación mantiene el mismo período, hace explícitos los supuestos y explica qué cambia entre escenarios." },
    ],
  },
  "consultoria-financiera": {
    sections: [
      { title: "Beneficios de estructurar la decisión", body: "Obtén una pregunta precisa, variables comparables y un registro de supuestos. Esto facilita conversar sobre alternativas y saber qué evidencia podría cambiar el análisis." },
      { title: "Contenidos de trabajo", body: "Objetivo y restricciones, diagnóstico de información disponible, criterios comparables y escenarios. El ejercicio de liquidez ilustra cómo un retraso de cobro puede cambiar el saldo de caja de un período." },
    ],
    faq: [
      { title: "¿Qué debo preparar para solicitar información?", body: "Describe la decisión, el plazo y si es para ti o para un equipo. Reserva documentos y datos sensibles para un canal y tratamiento expresamente acordados." },
      { title: "¿La consultoría ejecuta operaciones o custodia activos?", body: "La actividad se limita a estructurar el análisis financiero. La ejecución de operaciones, apertura de cuentas y custodia de activos quedan fuera de su alcance." },
    ],
  },
} satisfies Record<string, ServiceDetails>;
