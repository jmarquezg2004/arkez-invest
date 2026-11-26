import cash from "./cobros-y-caja.webp";
import apples from "./manzanas-y-riesgo.webp";

import scenarios from "./comparar-escenarios.webp";

export const stories = {
  caja: {
    title: "Vendimos. ¿Y la caja?",
    image: cash,
    heading: "h3",
    panels: [
      { dialogue: "Pedido entregado.", alt: "Inés entrega un cuenco de cerámica envuelto a una clienta.", caption: "Lunes. Inés entrega el pedido y emite la factura." },
      { dialogue: "¿Y el cobro?", alt: "Con el taller vacío, Inés mira la factura junto a la caja casi vacía.", caption: "La venta ya está hecha. El dinero todavía no entra." },
      { dialogue: "Lo espero el viernes.", alt: "Inés anota la fecha en un calendario de papel.", caption: "Inés marca cuándo espera el cobro. La factura tendrá que esperar." },
    ],
    takeaway: "Un presupuesto de caja registra cuándo esperas cobrar y pagar. Esa fecha puede ser distinta de la fecha de venta.",
  },
  diversificacion: {
    title: "Todas las manzanas en una bolsa",
    image: apples,
    heading: "h2",
    panels: [
      { dialogue: "Una bolsa basta.", alt: "Inés pone todas las manzanas verdes en una misma bolsa.", caption: "Una sola bolsa. Todo parece más fácil." },
      { dialogue: "¡La costura!", alt: "Se rompe la costura y las manzanas ruedan por el suelo.", caption: "Una sola costura sostenía todas las manzanas." },
      { dialogue: "Bueno… casi todas.", alt: "Inés usa dos canastas distintas. Aun así, una manzana cae.", caption: "Dos canastas. Una manzana todavía se escapa." },
    ],
    takeaway: "Diversificar reduce la dependencia de un solo resultado. Varias posiciones también pueden perder valor al mismo tiempo.",
  },
  escenarios: {
    title: "Una cosa a la vez",
    image: scenarios,
    heading: "h3",
    panels: [
      { dialogue: "¿Qué cambió?", alt: "Inés observa dos alternativas de entrega en su taller de cerámica.", caption: "Si cambian el plazo y el costo a la vez, cuesta entender qué explica el resultado." },
      { dialogue: "Mismo pedido.", alt: "Inés compara dos cajas de cerámica iguales sobre la mesa.", caption: "Inés iguala el pedido y el costo para poder comparar." },
      { dialogue: "Solo cambia el plazo.", alt: "Junto a dos furgonetas en miniatura, Inés señala dos relojes distintos.", caption: "Ahora puede observar el efecto de entregar antes o después." },
    ],
    takeaway: "Usa la misma unidad y el mismo periodo. Cambia una variable por vez para entender su efecto.",
  },
} as const;
