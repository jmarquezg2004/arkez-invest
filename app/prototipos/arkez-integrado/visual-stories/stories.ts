import cash from "./cobros-y-caja.webp";
import apples from "./manzanas-y-riesgo.webp";

export const stories = {
  caja: {
    title: "Vendimos. ¿Y la caja?",
    image: cash,
    panels: [
      { alt: "Inés entrega un cuenco de cerámica envuelto a una clienta.", caption: "Lunes. Inés entrega el pedido y emite la factura." },
      { alt: "Con el taller vacío, Inés mira la factura junto a la caja casi vacía.", caption: "La venta ya está hecha. El dinero todavía no entra." },
      { alt: "Inés anota la fecha en un calendario de papel.", caption: "Inés marca cuándo espera el cobro. La factura tendrá que esperar." },
    ],
    takeaway: "Un presupuesto de caja registra cuándo esperas cobrar y pagar. Esa fecha puede ser distinta de la fecha de venta.",
  },
  diversificacion: {
    title: "Todas las manzanas en una bolsa",
    image: apples,
    panels: [
      { alt: "Inés pone todas las manzanas verdes en una misma bolsa.", caption: "Una sola bolsa. Todo parece más fácil." },
      { alt: "Se rompe la costura y las manzanas ruedan por el suelo.", caption: "Una sola costura sostenía todas las manzanas." },
      { alt: "Inés usa dos canastas distintas. Aun así, una manzana cae.", caption: "Dos canastas. Una manzana todavía se escapa." },
    ],
    takeaway: "Diversificar reduce la dependencia de un solo resultado. Varias posiciones también pueden perder valor al mismo tiempo.",
  },
} as const;
