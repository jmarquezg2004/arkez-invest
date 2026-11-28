type Panels = readonly [string, string, string, string];
type StoryCopy = { title: string; prompts: Panels; captions: Panels; takeaway: string };
type CompanyStory = { source: string; es: StoryCopy; en: StoryCopy };

const stories: Record<string, CompanyStory> = {
  "NASDAQ:ODD": {
    source: "https://www.sec.gov/Archives/edgar/data/1907085/000110465926029490/odd-20251231x20f.htm",
    es: {
      title: "¿Cómo gana dinero ODDITY?",
      prompts: ["¿Qué tono me queda?", "¿Quién paga?", "¿Cuánto cuesta atraer a alguien?", "¿Volverán a comprar?"],
      captions: ["ODDITY desarrolla marcas de belleza y bienestar. Una clienta puede usar las herramientas de la marca para elegir un tono en línea.", "El cliente paga el producto en la tienda de la marca. La venta directa genera ingresos para ODDITY.", "La empresa gasta en publicidad para llegar a nuevos clientes. Revisa cómo cambia ese gasto en relación con las ventas.", "Las compras repetidas pueden sostener parte de las ventas. Contrasta la evolución de los ingresos con los costos de comercialización."],
      takeaway: "Sigue un pedido desde el descubrimiento del producto hasta la compra y la posible recompra.",
    },
    en: {
      title: "How does ODDITY make money?",
      prompts: ["Which shade suits me?", "Who pays?", "What does it cost to attract shoppers?", "Will customers come back?"],
      captions: ["ODDITY develops beauty and wellness brands. A shopper can use the brand’s tools to choose a shade online.", "The customer pays for the product in the brand’s online store. That direct sale generates revenue for ODDITY.", "The company spends on advertising to reach new customers. Compare how that expense moves relative to sales.", "Repeat purchases can support some sales. Compare revenue trends with selling and marketing expenses."],
      takeaway: "Follow an order from product discovery through purchase and possible repeat purchases.",
    },
  },
  "NASDAQ:TTD": {
    source: "https://www.sec.gov/Archives/edgar/data/1671933/000167193326000014/ttd-20251231.htm",
    es: {
      title: "¿Cómo gana dinero The Trade Desk?",
      prompts: ["¿Dónde pongo este anuncio?", "¿Quién paga la plataforma?", "¿Qué aportan los datos?", "¿Qué cifra debo comparar?"],
      captions: ["The Trade Desk ofrece software para comprar espacios de publicidad digital en distintos medios.", "Los anunciantes y sus agencias usan la plataforma para planear y ejecutar campañas. The Trade Desk cobra por su uso.", "Los datos y servicios de medición ayudan a seleccionar y evaluar espacios publicitarios. Su uso puede generar cargos adicionales.", "Distingue el gasto publicitario que pasa por la plataforma de los ingresos reconocidos por la empresa. El 10-K explica la diferencia."],
      takeaway: "El presupuesto del anunciante ayuda a explicar el volumen del negocio; los ingresos muestran lo que cobra la plataforma.",
    },
    en: {
      title: "How does The Trade Desk make money?",
      prompts: ["Where should this ad go?", "Who pays for the platform?", "What do the data add?", "Which figure should I compare?"],
      captions: ["The Trade Desk sells software for buying digital advertising space across different media.", "Advertisers and agencies use the platform to plan and run campaigns. The Trade Desk charges them to use it.", "Data and measurement services help users select and assess ad placements. These services can add fees.", "Separate advertising spend handled by the platform from revenue recognized by the company. The annual filing explains the difference."],
      takeaway: "The advertising budget indicates the volume handled; revenue shows what the platform charges.",
    },
  },
  "NYSE:KSS": {
    source: "https://www.sec.gov/Archives/edgar/data/885639/000119312526115982/kss-20260131.htm",
    es: {
      title: "¿Cómo gana dinero Kohl’s?",
      prompts: ["¿Qué vende?", "¿Quién paga?", "¿Y si compro en línea?", "¿Qué vale la pena revisar?"],
      captions: ["Kohl’s es una cadena estadounidense de tiendas por departamentos. Vende ropa, calzado y artículos para el hogar, entre otros productos.", "Los clientes pagan por los productos. El margen bruto mide qué proporción de las ventas queda después de descontar el costo de la mercancía vendida.", "La web y la app son otros canales de venta. En pedidos elegibles, una persona puede comprar por internet y recoger en tienda.", "Observa cómo cambian las ventas comparables, el margen bruto y el inventario. Las rebajas ayudan a mover mercancía, pero también pueden reducir el margen."],
      takeaway: "El negocio combina tiendas y comercio digital. Importa cuánto vende y cuánto conserva de cada venta.",
    },
    en: {
      title: "How does Kohl’s make money?",
      prompts: ["What does it sell?", "Who pays?", "What if I shop online?", "What should I check?"],
      captions: ["Kohl’s is a US department store chain. It sells apparel, footwear, and home goods, among other products.", "Customers pay for merchandise. Gross margin reflects what is left from sales after subtracting the cost of the goods sold.", "Its website and app are additional sales channels. Shoppers can collect eligible online orders in stores.", "Watch comparable sales, gross margin, and inventory. Markdowns can help clear stock and also reduce margins."],
      takeaway: "The business combines stores and e-commerce. How much it sells and what it keeps from sales both matter.",
    },
  },
  "NYSE:NU": {
    source: "https://www.sec.gov/Archives/edgar/data/1691493/000129281426002166/nuform20f_2025.htm",
    es: {
      title: "¿Cómo gana dinero Nubank?",
      prompts: ["¿Un banco en el móvil?", "¿Qué pasa cuando pago?", "¿De dónde salen los intereses?", "¿Qué pasa si alguien no paga?"],
      captions: ["Nu ofrece cuentas, tarjetas y crédito mediante una app. La oferta depende del país.", "Las tarjetas generan ingresos vinculados a las transacciones. Algunas operaciones también pueden generar comisiones.", "El crédito genera intereses. Los depósitos y otras fuentes de financiación también tienen un costo para el banco.", "Compara el margen financiero con las pérdidas crediticias. Una cartera más grande no basta para entender el resultado."],
      takeaway: "Para entender la banca digital, sigue el pago, el préstamo y el costo de financiarlo.",
    },
    en: {
      title: "How does Nubank make money?",
      prompts: ["A bank on my phone?", "What happens when I pay?", "Where does interest come from?", "What if someone misses a payment?"],
      captions: ["Nu provides accounts, cards, and loans through an app. The products offered vary by country.", "Cards generate revenue tied to payments. Some transactions can also generate fees.", "Loans earn interest. Deposits and other sources of funding also cost the bank money.", "Compare the interest margin with credit losses. A larger loan portfolio tells only part of the story."],
      takeaway: "To understand a digital bank, follow the payment, the loan, and the cost of funding it.",
    },
  },
  "NASDAQ:AAPL": {
    source: "https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250927.htm",
    es: {
      title: "¿Cómo gana dinero Apple?",
      prompts: ["¿Todo empieza con el iPhone?", "¿Quién paga por los equipos?", "¿Y después de la compra?", "¿Dónde veo la diferencia?"],
      captions: ["Apple vende dispositivos como iPhone, Mac e iPad. También ofrece accesorios y servicios.", "Los equipos se venden directamente y a través de distribuidores, operadores y otros comercios.", "La tienda de aplicaciones, la nube y varias suscripciones forman parte de Servicios. Sus ingresos pueden continuar después de vender el dispositivo.", "El informe anual separa Productos y Servicios. Contrasta sus ventas y márgenes brutos."],
      takeaway: "Un dispositivo genera una venta. El uso posterior del ecosistema puede generar otros ingresos.",
    },
    en: {
      title: "How does Apple make money?",
      prompts: ["Does it start with the iPhone?", "Who pays for the hardware?", "What happens after purchase?", "Where can I see the difference?"],
      captions: ["Apple sells devices such as the iPhone, Mac, and iPad. It also offers accessories and services.", "Hardware is sold directly and through distributors, carriers, and other retailers.", "The app store, cloud services, and subscriptions are part of Services. Revenue can continue after a device is sold.", "The annual report separates Products and Services. Compare their sales and gross margins."],
      takeaway: "A device generates a sale. Using the ecosystem afterward can generate other revenue.",
    },
  },
  "AMEX:SPY": {
    source: "https://www.ssga.com/us/en/intermediary/etfs/spdr-s-p-500-etf-trust-spy",
    es: {
      title: "¿Qué hay dentro de SPY?",
      prompts: ["¿Una acción o un fondo?", "¿Qué contiene?", "¿Qué precio estoy viendo?", "¿Qué cuesta mantenerlo?"],
      captions: ["SPY es un fondo cotizado que busca seguir el S&P 500. Una unidad representa una participación en el fondo.", "La cartera reúne acciones de grandes empresas estadounidenses. El peso de cada posición influye en el resultado del fondo.", "El precio de la unidad cambia en bolsa. El valor liquidativo refleja el valor de la cartera por unidad.", "La ficha oficial publica gastos, posiciones y objetivo. También permite comparar lo que hace el fondo con lo que busca replicar."],
      takeaway: "Cuando consultas un ETF, empieza por su cartera, su objetivo y sus gastos.",
    },
    en: {
      title: "What’s inside SPY?",
      prompts: ["A stock or a fund?", "What does it hold?", "Which price am I seeing?", "What does it cost to hold?"],
      captions: ["SPY is an exchange-traded fund that seeks to track the S&P 500. One unit represents an interest in the fund.", "The portfolio holds shares of large US companies. The weight of each position affects the fund’s results.", "The market price changes on the exchange. Net asset value reflects the value of the portfolio per unit.", "The issuer’s fact sheet publishes expenses, holdings, and the objective. It also helps compare fund performance with its target index."],
      takeaway: "When reading about an ETF, start with its holdings, objective, and expenses.",
    },
  },
};

export function companyStoryFor(symbol: string) {
  return Object.hasOwn(stories, symbol) ? stories[symbol] : undefined;
}
