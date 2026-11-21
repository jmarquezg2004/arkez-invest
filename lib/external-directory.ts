type Source = {
  name: string;
  description: string;
  href: string;
};

export const investorCalculator = "https://www.investor.gov/financial-tools-calculators/calculators/calculadora-de-interes-compuesto";

export const newsSections = [
  {
    id: "mercados", title: "Mercados y economía",
    sources: [
      { name: "Banco de la República", description: "Comunicados, minutas e información económica de Colombia.", href: "https://www.banrep.gov.co/es/noticias" },
      { name: "Reserva Federal de Estados Unidos", description: "Comunicados, discursos y publicaciones de política monetaria.", href: "https://www.federalreserve.gov/newsevents.htm" },
    ],
  },
  {
    id: "tecnologia", title: "Tecnología financiera",
    sources: [
      { name: "Centro de Innovación del BIS", description: "Proyectos, informes y novedades sobre tecnología financiera de bancos centrales.", href: "https://www.bis.org/about/innovation-hub/overview" },
      { name: "Financial Conduct Authority", description: "Programas de innovación y novedades del regulador financiero del Reino Unido.", href: "https://www.fca.org.uk/firms/innovation" },
    ],
  },
  {
    id: "educacion", title: "Educación y oportunidades",
    sources: [
      { name: "Investor.gov", description: "Guías, alertas y herramientas educativas de la SEC.", href: "https://www.investor.gov/" },
      { name: "OCDE", description: "Publicaciones e iniciativas de educación financiera.", href: "https://www.oecd.org/en/topics/financial-education.html" },
    ],
  },
] as const satisfies readonly { id: string; title: string; sources: readonly Source[] }[];

export const editorialNews = {
  mercados: {
    title: "Informe de Política Monetaria de octubre de 2026",
    date: "2026-11-04",
    source: "Banco de la República",
    href: "https://www.banrep.gov.co/es/publicaciones-investigaciones/informe-politica-monetaria/octubre-2026",
  },
  tecnologia: {
    title: "Proyecto Agorá y el uso de la tokenización en pagos internacionales",
    date: "2026-05-27",
    source: "Banco de Pagos Internacionales (BIS)",
    href: "https://www.bis.org/media-releases/20260527-project-agora-shows-how-tokenisation-can-improve-wholesale-cross-border-payments-work-will",
  },
  educacion: {
    title: "La importancia de hablar de dinero con los jóvenes",
    date: "2026-03-16",
    source: "OCDE",
    href: "https://www.oecd.org/en/blogs/2026/03/global-money-week-why-open-conversations-about-money-matter-for-young-people.html",
  },
} as const satisfies Record<(typeof newsSections)[number]["id"], { title: string; date: string; source: string; href: string }>;

export const ecosystemSections = [
  {
    id: "mercados", title: "Brókers y mercados",
    sources: [
      { name: "Nasdaq", description: "Información de índices y mercados que puedes consultar como referencia.", href: "https://www.nasdaq.com/market-activity" },
      { name: "CME Group", description: "Material educativo sobre futuros, opciones y el funcionamiento de sus mercados.", href: "https://www.cmegroup.com/education" },
    ],
  },
  {
    id: "activos-digitales", title: "Exchanges y activos digitales",
    sources: [
      { name: "Kraken Learn", description: "Artículos educativos de un exchange sobre activos digitales y sus conceptos básicos.", href: "https://www.kraken.com/learn" },
      { name: "Coinbase Learn", description: "Glosario y explicaciones del proveedor sobre criptomonedas y blockchain.", href: "https://www.coinbase.com/learn/crypto-basics" },
    ],
  },
  {
    id: "fintech", title: "Fintech",
    sources: [
      { name: "Wise", description: "Información del proveedor sobre transferencias internacionales y monedas.", href: "https://wise.com/" },
      { name: "Centro de Innovación del BIS", description: "Proyectos públicos sobre pagos digitales y tecnología financiera.", href: "https://www.bis.org/about/innovation-hub/overview" },
    ],
  },
  {
    id: "formacion", title: "Formación y eventos",
    sources: [
      { name: "CFA Institute", description: "Agenda institucional de conferencias y seminarios sobre finanzas.", href: "https://www.cfainstitute.org/insights/events/upcoming" },
      { name: "Investor.gov", description: "Material de educación para inversionistas publicado por la SEC de Estados Unidos.", href: "https://www.investor.gov/" },
    ],
  },
] as const satisfies readonly { id: string; title: string; sources: readonly Source[] }[];
