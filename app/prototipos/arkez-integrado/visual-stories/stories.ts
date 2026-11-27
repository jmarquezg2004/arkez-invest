import oddity from "./oddity-en-cuatro-vinetas.webp";
import oddityCover from "./portada-oddity.webp";
import cash from "./cobros-y-caja.webp";
import cashCover from "./portada-cash.webp";
import apples from "./manzanas-y-riesgo.webp";
import applesCover from "./portada-apples.webp";
import scenarios from "./comparar-escenarios.webp";
import scenariosCover from "./portada-scenarios.webp";
import sources from "./verificar-la-cifra.webp";
import sourcesCover from "./portada-sources.webp";
import inflation from "./mismas-monedas.webp";
import inflationCover from "./portada-inflation.webp";
import timing from "./fecha-y-disponibilidad.webp";
import timingCover from "./portada-timing.webp";
import payments from "./pago-y-abono.webp";
import paymentsCover from "./portada-payments.webp";

export const stories = {
  caja: {
    route: "/recursos/guias/#liquidez-operativa",
    topic: "Flujo de caja",
    title: "Vendimos. ¿Y la caja?",
    image: cash,
    cover: cashCover,
    heading: "h3",
    panels: [
      { dialogue: "Pedido entregado.", alt: "Isa entrega un cuenco de cerámica envuelto a una clienta.", caption: "Lunes. Isa entrega el pedido y emite la factura." },
      { dialogue: "¿Y el cobro?", alt: "Con el taller vacío, Isa mira la factura junto a la caja casi vacía.", caption: "La venta ya está hecha. El dinero todavía no entra." },
      { dialogue: "Lo espero el viernes.", alt: "Isa anota la fecha en un calendario de papel.", caption: "Isa marca cuándo espera el cobro. La factura tendrá que esperar." },
    ],
    takeaway: "Un presupuesto de caja registra cuándo esperas cobrar y pagar. Esa fecha puede ser distinta de la fecha de venta.",
  },
  diversificacion: {
    route: "/recursos/articulos/que-es-diversificar/",
    topic: "Diversificación",
    title: "Todas las manzanas en una bolsa",
    image: apples,
    cover: applesCover,
    heading: "h2",
    panels: [
      { dialogue: "Una bolsa basta.", alt: "Isa pone todas las manzanas verdes en una misma bolsa.", caption: "Una sola bolsa. Todo parece más fácil." },
      { dialogue: "¡La costura!", alt: "Se rompe la costura y las manzanas ruedan por el suelo.", caption: "Una sola costura sostenía todas las manzanas." },
      { dialogue: "Bueno… casi todas.", alt: "Isa usa dos canastas distintas. Aun así, una manzana cae.", caption: "Dos canastas. Una manzana todavía se escapa." },
    ],
    takeaway: "Diversificar reduce la dependencia de un solo resultado. Varias posiciones también pueden perder valor al mismo tiempo.",
  },
  escenarios: {
    route: "/recursos/guias/#comparar-escenarios",
    topic: "Comparación de escenarios",
    title: "Una cosa a la vez",
    image: scenarios,
    cover: scenariosCover,
    heading: "h3",
    panels: [
      { dialogue: "¿Qué cambió?", alt: "Isa observa dos alternativas de entrega en su taller de cerámica.", caption: "Si cambian el plazo y el costo a la vez, cuesta entender qué explica el resultado." },
      { dialogue: "Mismo pedido.", alt: "Isa compara dos cajas de cerámica iguales sobre la mesa.", caption: "Isa iguala el pedido y el costo para poder comparar." },
      { dialogue: "Solo cambia el plazo.", alt: "Junto a dos furgonetas en miniatura, Isa señala dos relojes distintos.", caption: "Ahora puede observar el efecto de entregar antes o después." },
    ],
    takeaway: "Usa la misma unidad y el mismo periodo. Cambia una variable por vez para entender su efecto.",
  },
  fuentes: {
    route: "/recursos/guias/#revisar-fuentes",
    topic: "Verificación de datos",
    title: "¿La misma cifra?",
    image: sources,
    cover: sourcesCover,
    heading: "h3",
    panels: [
      { dialogue: "¿Cómo que cambió?", alt: "Isa mira dos hojas con barras distintas.", caption: "Dos publicaciones muestran resultados distintos para lo que parece la misma cifra." },
      { dialogue: "A ver la fecha…", alt: "Isa examina una de las hojas con una lupa, junto a un calendario.", caption: "Comprueba quién publicó el dato, qué periodo describe y en qué unidad está expresado." },
      { dialogue: "¡Eran meses distintos!", alt: "Isa compara las hojas una junto a la otra.", caption: "Los resultados corresponden a periodos distintos. Isa anota la diferencia antes de compararlos." },
    ],
    takeaway: "Antes de comparar dos cifras, confirma que se refieran al mismo concepto, periodo y unidad.",
  },
  inflacion: {
    route: "/recursos/articulos/#inflacion",
    topic: "Poder adquisitivo",
    title: "El mismo dinero, una bolsa más pequeña",
    image: inflation,
    cover: inflationCover,
    heading: "h3",
    panels: [
      { dialogue: "Me alcanza.", alt: "Isa sostiene unas monedas junto a una bolsa de mercado llena.", caption: "Isa compra su habitual selección de alimentos." },
      { dialogue: "Traje lo mismo.", alt: "En otra visita, Isa muestra sus monedas y el vendedor señala una etiqueta.", caption: "Con el paso del tiempo, los precios de varios alimentos del ejemplo suben." },
      { dialogue: "La bolsa se encogió.", alt: "Isa mira una bolsa más pequeña con menos alimentos.", caption: "Con las mismas monedas, ahora puede comprar menos." },
    ],
    takeaway: "La inflación mide el aumento general de precios. El cambio de precio de un solo producto no basta para medirla.",
  },
  plazos: {
    route: "/recursos/guias/primeros-pasos/#objetivo-fecha-fija",
    topic: "Plazos y disponibilidad",
    title: "El calendario también cuenta",
    image: timing,
    cover: timingCover,
    heading: "h3",
    panels: [
      { dialogue: "El curso ya tiene fecha.", alt: "Isa marca una fecha en el calendario, junto a un folleto de cerámica.", caption: "Lo primero que apunta Isa es cuándo tendrá que pagar el curso." },
      { dialogue: "¿Cuándo abre esta caja?", alt: "Sobre el escritorio hay una caja con candado y un reloj de bolsillo.", caption: "En el ejemplo, el dinero guardado no está disponible de inmediato." },
      { dialogue: "Necesito las dos fechas.", alt: "Isa compara el calendario con la caja.", caption: "Isa compara la fecha del pago con el día en que podrá disponer del dinero." },
    ],
    takeaway: "Cuando una meta tiene fecha fija, compara el día en que necesitas pagar con el día en que el dinero estará disponible.",
  },
  pagos: {
    route: "/ecosistema/#fintech",
    topic: "Tecnología de pagos",
    title: "El pitido y el abono",
    image: payments,
    cover: paymentsCover,
    heading: "h3",
    panels: [
      { dialogue: "Ya pasó la tarjeta.", alt: "Una clienta acerca una tarjeta al terminal del taller.", caption: "La compra con tarjeta se autoriza en el mostrador." },
      { dialogue: "¿Ya entró a mi cuenta?", alt: "Isa revisa el comprobante de pago junto a su calendario.", caption: "Isa distingue el comprobante de la fecha en que el proveedor abonará el dinero." },
      { dialogue: "Ahora sí aparece.", alt: "Isa revisa los movimientos en el teléfono y hace una marca en su cuaderno.", caption: "Cuando llega el abono, Isa compara el movimiento con el comprobante." },
    ],
    takeaway: "Autorización y abono son momentos distintos. El plazo depende del medio de pago y las condiciones del proveedor.",
  },
  oddity: {
    topic: "Modelos de negocio",
    title: "¿Cómo gana dinero ODDITY?",
    image: oddity,
    cover: oddityCover,
    heading: "h2",
    panels: [
      { dialogue: "¿Qué tono me queda?", alt: "Isa compara tonos de maquillaje en un teléfono.", caption: "Qué hace. ODDITY desarrolla marcas de belleza y bienestar. En este ejemplo, una clienta busca maquillaje de IL MAKIAGE en internet." },
      { dialogue: "Llegó mi pedido.", alt: "Isa abre un paquete con un producto cosmético.", caption: "Quién paga. La clienta paga el producto en la tienda de la marca. La venta directa al consumidor genera ingresos para ODDITY." },
      { dialogue: "¿Cuánto costó esa venta?", alt: "Isa compara un producto con el costo de anunciarlo.", caption: "Qué necesita para crecer. Atraer clientes cuesta dinero. Importa cuánto cuesta conseguir la primera compra y si luego vuelven a pedir." },
      { dialogue: "Dos futuros posibles.", alt: "Isa observa una nueva compra y, al otro lado, el costo de anunciarse.", caption: "Qué podría pasar en 3–5 años. Si aumenta la recompra, el negocio puede depender menos de captar nuevos clientes. Si la captación se encarece, la rentabilidad puede resentirse." },
    ],
    takeaway: "Sigue el recorrido del pedido: quién paga, cuánto cuesta conseguir la venta y qué hace que un cliente vuelva.",
  },
} as const;

export type StoryKey = keyof typeof stories;

export function storyAnchor(story: StoryKey) {
  return `historia-${story}`;
}
