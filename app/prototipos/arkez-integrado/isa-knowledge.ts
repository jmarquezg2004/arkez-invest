export type IsaLanguage = "es" | "en";
export type IsaAnswer = { message: string; href?: string; sources?: readonly { label: string; href: string }[]; localModel?: boolean };
type Entry = {
  mentions: RegExp;
  intent: RegExp;
  exclude?: RegExp;
  href: string;
  es: string;
  en: string;
};

const explanation = /\b(que es|que son|que significa|como funciona|explica|definicion|diferencia|what is|what are|how does|explain|difference)\b/;
const transfer = /\b(transfer\w*|envi\w*|mandar|send\w*|withdraw\w*|retiro|retirar)\b/;
const entries: readonly Entry[] = [
  {
    mentions: /\b(criptomoneda\w*|criptoactivo\w*|cripto\w*|crypto\w*|bitcoin|btc|ether|ethereum|eth|usdc|usdt|tokens?)\b/,
    intent: transfer,
    href: "/research/visual-stories/#historia-tema-cripto",
    es: "En una transferencia de criptomonedas, la billetera firma una instrucción que indica cuánto se mueve y a qué dirección de la red. La red verifica y registra la operación. El identificador de la transacción permite consultar su estado. Por ejemplo, una transferencia puede figurar como pendiente antes de confirmarse. Puede haber comisiones, y usar una dirección o red equivocada puede causar una pérdida irreversible. La frase de recuperación y la clave privada se mantienen en secreto.",
    en: "In a cryptocurrency transfer, a wallet signs an instruction specifying the amount and the recipient's network address. The network verifies and records it. The transaction ID lets you check its status, such as pending or confirmed. Fees may apply, and a wrong address or network can cause an irreversible loss. Keep recovery phrases and private keys secret.",
  },
  {
    mentions: /\b(criptomoneda\w*|criptoactivo\w*|cripto|crypto\w*)\b/,
    intent: explanation,
    exclude: transfer,
    href: "/research/visual-stories/#historia-tema-cripto",
    es: "Un criptoactivo es un activo digital cuyo registro depende de una red. Las reglas de esa red y la forma de custodiarlo determinan quién puede moverlo o recuperar el acceso.",
    en: "A crypto asset is a digital asset recorded on a network. The network's rules and the custody arrangement determine who can move the asset or recover access.",
  },
  {
    mentions: /\b(interes compuesto|compound interest|capitalizacion)\b/,
    intent: /\b(que es|como|ejemplo|explica|how|what is|example|explain)\b/,
    href: "/herramientas/interes-compuesto/",
    es: "El interés compuesto se calcula sobre el saldo acumulado, incluidos los intereses anteriores. En un ejemplo ficticio, USD 100 al 10 % anual serían USD 110 al cabo de un año y USD 121 al cabo de dos, sin aportes ni comisiones.",
    en: "Compound interest is calculated on the accumulated balance, including past interest. In a fictional example, USD 100 at 10% per year would become USD 110 after a year and USD 121 after two, with no contributions or fees.",
  },
  {
    mentions: /\b(diversific\w*)\b/,
    intent: /\b(que es|como funciona|ejemplo|explica|what is|how does|example|explain)\b/,
    href: "/recursos/articulos/que-es-diversificar/",
    es: "Diversificar es repartir la exposición entre inversiones con riesgos distintos. Dos fondos con las mismas empresas principales pueden verse afectados por el mismo evento. Compara sus posiciones para detectar ese solapamiento.",
    en: "Diversification spreads exposure across investments with different risks. Two funds with the same largest holdings may be affected by the same event. Compare their holdings to spot the overlap.",
  },
  {
    mentions: /\b(inflacion|inflation)\b/,
    intent: explanation,
    href: "/recursos/articulos/#inflacion",
    es: "La inflación es el aumento general de los precios a lo largo del tiempo. Si la misma canasta pasa de USD 50 a USD 55, su precio subió un 10 %. Tu dinero compra menos de esa canasta.",
    en: "Inflation is a general rise in prices over time. If the same basket goes from USD 50 to USD 55, its price rose by 10%. Your money buys less of that basket.",
  },
];

export function answerFromLibrary(question: string, locale: IsaLanguage): IsaAnswer | undefined {
  const normalized = question.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, " ").trim();

  // Refer broad, multi-part and personalized queries to the existing fallback.
  if (/\b(recomienda\w*|cual me conviene|should i|recommend\w*|pronostic\w*|predic\w*)\b/.test(normalized)
      || question.indexOf("?") !== question.lastIndexOf("?")) return;

  if (/\b(colombia\w*)\b/.test(normalized)
    && /\b(estados unidos|united states|ee uu|usa|u s|us|nyse|wall street)\b/.test(normalized)
    && !/\b(nasdaq|otc|todas?|all|complete|completa)\b/.test(normalized)
    && /\b(cotiza\w*|list\w*|traded?|bolsa|acciones|stock exchange|adr|ads)\b/.test(normalized)) {
    return {
      message: locale === "es"
        ? "Tres ejemplos documentados en la Bolsa de Nueva York (NYSE) son Ecopetrol (EC), Grupo Cibest (CIB) y Grupo Aval (AVAL). Se negocian mediante ADS, certificados que representan acciones. CIB identifica a Grupo Cibest desde mayo de 2025, cuando reemplazó a Bancolombia como emisor de esos ADS. La selección es ilustrativa y se basa en reportes de la SEC de 2026."
        : "Three documented examples on the New York Stock Exchange are Ecopetrol (EC), Grupo Cibest (CIB), and Grupo Aval (AVAL). They trade through ADSs, which represent shares. Since May 2025, CIB has identified Grupo Cibest, which replaced Bancolombia as the issuer of those ADSs. These examples are based on 2026 SEC filings.",
      sources: [
        { label: "SEC · Ecopetrol (EC)", href: "https://www.sec.gov/Archives/edgar/data/1444406/000110465926053172/ec-20251231x20f.htm" },
        { label: "SEC · Grupo Cibest (CIB)", href: "https://www.sec.gov/Archives/edgar/data/2058897/000205889726000125/cib-20251231.htm" },
        { label: "SEC · Grupo Aval (AVAL)", href: "https://www.sec.gov/Archives/edgar/data/1504764/000110465926044493/aval-20251231x20f.htm" },
      ],
    };
  }

  const matches = entries.filter(({ mentions, intent, exclude }) => mentions.test(normalized) && intent.test(normalized) && !exclude?.test(normalized));
  if (matches.length === 1) return { message: matches[0][locale], href: matches[0].href };
}
