export type SiteLink = { readonly label: string; readonly href: string };

type NavigationGroup = SiteLink & {
  readonly children: readonly SiteLink[];
};

export const siteName = "Arkez Invest";
export const siteUrl = "https://arkezinvest.com";
export const contactLink = { label: "Contacto", href: "/contacto/" };
export const educationLink = {
  label: "Educación financiera",
  href: "/servicios/educacion-financiera/",
};
export const firstGuideLink = {
  label: "Primeros pasos para invertir",
  href: "/recursos/guias/primeros-pasos/",
};

export const navigation: readonly NavigationGroup[] = [
  {
    label: "Servicios",
    href: "/servicios/",
    children: [
      educationLink,
      { label: "Metodología", href: "/servicios/metodologia/" },
    ],
  },
  {
    label: "Para quién",
    href: "/para-quien/",
    children: [
      { label: "Personas", href: "/para-quien/personas/" },
      { label: "Empresas", href: "/para-quien/empresas/" },
    ],
  },
  {
    label: "Recursos",
    href: "/recursos/",
    children: [
      { label: "Guías", href: "/recursos/guias/" },
      { label: "Artículos", href: "/recursos/articulos/" },
      { label: "Preguntas frecuentes", href: "/recursos/preguntas-frecuentes/" },
    ],
  },
  {
    label: "Nosotros",
    href: "/nosotros/",
    children: [
      { label: "Misión y equipo", href: "/nosotros/mision-y-equipo/" },
      { label: "Transparencia", href: "/nosotros/transparencia/" },
    ],
  },
];

export const legalLinks: readonly SiteLink[] = [
  { label: "Privacidad", href: "/legal/privacidad/" },
  { label: "Términos", href: "/legal/terminos/" },
  { label: "Riesgos", href: "/legal/riesgos/" },
];

export const legacyLinks = [
  { id: "mision", href: "/nosotros/mision-y-equipo/", label: "Misión y equipo" },
  { id: "portafolio", href: educationLink.href, label: educationLink.label },
  { id: "clientes", href: "/para-quien/", label: "Para quién" },
  { id: "noticias", href: "/recursos/articulos/", label: "Artículos" },
  { id: "contacto", href: contactLink.href, label: "Contacto" },
] as const;
