type Panels = readonly [string, string, string, string];
type StoryCopy = { title: string; prompts: Panels; captions: Panels; takeaway: string; watch: readonly [string, string, string] };
export type CompanyStoryData = { source: string; es: StoryCopy; en: StoryCopy };

const stories: Record<string, CompanyStoryData> = {
  "NYSE:TGLS": {
    source: "https://www.sec.gov/Archives/edgar/data/1534675/000149315226050739/form10-q.htm",
    es: {
      title: "¿Cómo gana dinero Tecnoglass?",
      prompts: ["¿De dónde sale esta ventana?", "¿Quién compra las ventanas?", "¿Por qué fabricar las piezas?", "¿Y si arranca otra obra?"],
      captions: ["Tecnoglass transforma vidrio y aluminio en ventanas, puertas y fachadas para edificios.", "La empresa cobra por vender esos productos para casas y edificios. Estados Unidos es su principal mercado.", "Hacer sus propios perfiles de aluminio y procesar el vidrio le ayuda a controlar plazos y costos.", "Si hay más obras, Tecnoglass puede recibir más pedidos. Importa si puede fabricarlos y entregarlos a tiempo."],
      watch: ["Pedidos pendientes", "Demanda de construcción", "Costos de producción"],
      takeaway: "Tecnoglass convierte vidrio y aluminio en ventanas y fachadas que vende para proyectos de construcción.",
    },
    en: {
      title: "How does Tecnoglass make money?",
      prompts: ["Where did this window come from?", "Who buys the windows?", "Why make its own parts?", "What if another project starts?"],
      captions: ["Tecnoglass turns glass and aluminum into windows, doors, and façades for buildings.", "It earns money selling those products for homes and buildings. The United States is its main market.", "Making its own aluminum profiles and processing glass helps it manage costs and lead times.", "More construction can bring more orders. Tecnoglass still needs to make and deliver them on time."],
      watch: ["Open orders", "Construction demand", "Production costs"],
      takeaway: "Tecnoglass turns glass and aluminum into windows and façades that it sells for construction projects.",
    },
  },
  "NASDAQ:ODD": {
    source: "https://www.sec.gov/Archives/edgar/data/1907085/000110465926029490/odd-20251231x20f.htm",
    es: {
      title: "¿Cómo gana dinero ODDITY?",
      prompts: ["¿Y si pruebo el tono en línea?", "¡Me llegó el pedido!", "¿Lo compraría de nuevo?", "¿Alcanza para pagar los anuncios?"],
      captions: ["ODDITY usa herramientas en línea para ayudar a escoger maquillaje y productos de belleza.", "Gana dinero principalmente al vender sus propias marcas en sus tiendas en línea.", "Si el producto convence, la clienta puede volver a comprar cuando se le acabe.", "Los anuncios traen clientes, pero cuestan. El negocio mejora si las ventas cubren ese gasto."],
      watch: ["Ventas en línea", "Compras repetidas", "Gasto en publicidad"],
      takeaway: "ODDITY vende belleza por internet. Una buena primera compra puede convertirse en una recompra.",
    },
    en: {
      title: "How does ODDITY make money?",
      prompts: ["Can I try the shade online?", "My order’s here!", "Would I buy it again?", "Do sales pay for the ads?"],
      captions: ["ODDITY uses online tools to help shoppers choose makeup and beauty products.", "It makes most of its money selling its own brands through its online stores.", "If the product works for her, the customer may buy it again when she runs out.", "Ads bring in customers and cost money. The business improves if sales cover that expense."],
      watch: ["Online sales", "Repeat purchases", "Advertising spend"],
      takeaway: "ODDITY sells beauty products online. A good first purchase can lead to another.",
    },
  },
  "NASDAQ:TTD": {
    source: "https://www.sec.gov/Archives/edgar/data/1671933/000167193326000014/ttd-20251231.htm",
    es: {
      title: "¿Cómo gana dinero The Trade Desk?",
      prompts: ["¿Dónde pongo este anuncio?", "¿Quién cobra por colocarlo?", "¿Y si usamos más datos?", "¿Cuánto se queda la plataforma?"],
      captions: ["Una agencia usa The Trade Desk para comprar espacios publicitarios en sitios web, apps y televisión por internet.", "La plataforma suele cobrar una parte de lo que el cliente gasta en la campaña.", "La agencia también puede pagar por datos y herramientas que ayudan a elegir dónde mostrar el anuncio.", "Gran parte del presupuesto paga el espacio publicitario. Los ingresos de la empresa son lo que cobra por la plataforma y sus servicios."],
      watch: ["Gasto de clientes", "Ingresos de la plataforma", "Competencia"],
      takeaway: "The Trade Desk ayuda a comprar publicidad digital y cobra por hacer esa compra más fácil.",
    },
    en: {
      title: "How does The Trade Desk make money?",
      prompts: ["Where should this ad go?", "Who gets paid to place it?", "What if we use more data?", "How much does the platform keep?"],
      captions: ["An agency uses The Trade Desk to buy ad space on websites, in apps, and on internet-connected TVs.", "The platform usually charges a share of what the client spends on the campaign.", "The agency can also pay for data and tools that help it choose where to show the ad.", "Much of the budget pays for ad space. The company earns what it charges for the platform and its services."],
      watch: ["Client spending", "Platform revenue", "Competition"],
      takeaway: "The Trade Desk helps clients buy digital ads and charges for making that purchase easier.",
    },
  },
  "NYSE:KSS": {
    source: "https://www.sec.gov/Archives/edgar/data/885639/000119312526115982/kss-20260131.htm",
    es: {
      title: "¿Cómo gana dinero Kohl’s?",
      prompts: ["¡Me llevo este suéter!", "¿También gana con la tarjeta?", "¡Ya llegó mi pedido!", "¿Y si hay que rebajarlo?"],
      captions: ["Kohl’s gana dinero principalmente vendiendo ropa, calzado y artículos para el hogar.", "Kohl’s también recibe parte de lo que genera su programa de tarjetas con Capital One.", "La tienda en línea suma ventas. Algunos pedidos se pueden recoger en una tienda.", "Una rebaja ayuda a vender lo que queda, pero deja menos dinero por prenda si el costo es el mismo."],
      watch: ["Ventas en tiendas", "Mercancía sin vender", "Margen por prenda"],
      takeaway: "Kohl’s vive de vender mercancía. Las tiendas, la web y la tarjeta aportan al negocio.",
    },
    en: {
      title: "How does Kohl’s make money?",
      prompts: ["I’ll take this sweater!", "Does the card bring in money too?", "My order’s here!", "What if it goes on sale?"],
      captions: ["Kohl’s makes most of its money selling clothing, shoes, and home goods.", "Kohl’s also earns a share from its card program with Capital One.", "The online store adds sales. Some orders can be picked up in a store.", "A markdown helps clear unsold stock, but leaves less money per item if its cost stays the same."],
      watch: ["Store sales", "Unsold stock", "Margin per item"],
      takeaway: "Kohl’s makes its living selling goods. Stores, its website, and its card program all contribute.",
    },
  },
  "NYSE:NU": {
    source: "https://www.sec.gov/Archives/edgar/data/1691493/000129281426002166/nuform20f_2025.htm",
    es: {
      title: "¿Cómo gana dinero Nubank?",
      prompts: ["¡Mi banco cabe en el móvil!", "¿Qué gana Nu cuando pago?", "¿Y si pido un préstamo?", "¿Qué pasa si no pagan?"],
      captions: ["Nubank ofrece cuentas, tarjetas y préstamos desde una app, según el país.", "Cuando pagas con tarjeta, Nu puede recibir una parte del cargo que genera ese pago.", "Nu cobra intereses por sus préstamos. También le cuesta conseguir el dinero que presta.", "Si parte de los clientes deja de pagar, Nu puede perder dinero incluso cuando coloca más préstamos."],
      watch: ["Pagos con tarjeta", "Costo de financiarse", "Préstamos impagados"],
      takeaway: "Nubank genera ingresos con pagos y préstamos. Cuánto conserva depende de sus costos y de si le devuelven lo prestado.",
    },
    en: {
      title: "How does Nubank make money?",
      prompts: ["My bank fits in my pocket!", "What does Nu earn when I pay?", "What if I take out a loan?", "What if borrowers miss payments?"],
      captions: ["Nubank offers accounts, cards, and loans through an app. Products vary by country.", "When you pay by card, Nu can receive a share of the fee generated by the payment.", "Nu earns interest on its loans. It also pays to obtain the money it lends.", "If some customers stop repaying their loans, Nu can lose money even as it makes more loans."],
      watch: ["Card payments", "Funding costs", "Unpaid loans"],
      takeaway: "Nubank earns money from payments and lending. How much it keeps depends on costs and repayment.",
    },
  },
  "NASDAQ:AAPL": {
    source: "https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250927.htm",
    es: {
      title: "¿Cómo gana dinero Apple?",
      prompts: ["¿Qué vende Apple?", "¡Me llevo el iPhone!", "¿También cobra después?", "¿De dónde viene el crecimiento?"],
      captions: ["Apple diseña y vende equipos como iPhone, Mac e iPad.", "La venta del equipo genera ingresos, sea en una tienda de Apple o a través de distribuidores.", "Después de la compra, iCloud, las suscripciones y otros servicios pueden seguir generando ingresos.", "El informe anual muestra por separado cuánto factura Apple con los equipos y con los servicios."],
      watch: ["Ventas de equipos", "Ingresos por servicios", "Margen de cada negocio"],
      takeaway: "Apple gana cuando vende el equipo y puede seguir ganando mientras lo usas.",
    },
    en: {
      title: "How does Apple make money?",
      prompts: ["What does Apple sell?", "I’ll take the iPhone!", "Does it earn money after the sale?", "Where is growth coming from?"],
      captions: ["Apple designs and sells devices like the iPhone, Mac, and iPad.", "The device sale brings in revenue through Apple’s stores or through resellers.", "After the purchase, iCloud, subscriptions, and other services can keep bringing in revenue.", "The annual report shows separately how much Apple earns in revenue from its devices and services."],
      watch: ["Device sales", "Services revenue", "Margin by business"],
      takeaway: "Apple makes money when it sells the device and can keep earning while you use it.",
    },
  },
  "AMEX:SPY": {
    source: "https://www.ssga.com/us/en/intermediary/etfs/spdr-s-p-500-etf-trust-spy",
    es: {
      title: "¿Qué hay dentro de SPY?",
      prompts: ["¿Qué intenta seguir SPY?", "¿Qué hay en la canasta?", "¿Por qué cambia su precio?", "¿Cuánto cuesta el fondo?"],
      captions: ["SPY es un fondo que cotiza en bolsa y busca seguir al índice S&P 500.", "Cada unidad da acceso a una cartera de grandes empresas de Estados Unidos. Las de mayor peso tienen más influencia.", "Su precio cambia en bolsa y puede diferir del valor por unidad de los activos que contiene.", "El fondo cobra gastos. Su ficha oficial muestra cuánto cobra y qué tan de cerca sigue al índice."],
      watch: ["Empresas con mayor peso", "Gastos del fondo", "Diferencia frente al índice"],
      takeaway: "SPY reúne muchas empresas en una sola unidad. Su resultado depende de la cartera y de sus gastos.",
    },
    en: {
      title: "What’s inside SPY?",
      prompts: ["What does SPY track?", "What’s in the basket?", "Why does the price move?", "What does the fund cost?"],
      captions: ["SPY is an exchange-traded fund that aims to track the S&P 500 index.", "Each unit gives exposure to a basket of large US companies. The ones with the biggest weights have the most influence.", "Its market price changes and can differ from the per-unit value of the assets it holds.", "The fund charges expenses. Its official fact sheet shows the cost and how closely it tracks the index."],
      watch: ["Largest holdings", "Fund expenses", "Difference from the index"],
      takeaway: "SPY puts many companies into one unit. Its results depend on its holdings and expenses.",
    },
  },
};

export function companyStoryFor(symbol: string) {
  return Object.hasOwn(stories, symbol) ? stories[symbol] : undefined;
}
