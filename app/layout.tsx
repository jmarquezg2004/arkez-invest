import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteName, siteUrl } from "@/lib/navigation";

const description = "Arkez Invest ofrece recursos de educación financiera en español para entender los mercados, aprender sobre el riesgo y tomar decisiones con mayor criterio.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Arkez Invest | Educación financiera", template: "%s | Arkez Invest" },
  description,
  applicationName: siteName,
  robots: process.env.ARKEZ_INDEXABLE === "1" ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { type: "website", siteName, locale: "es", description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <a href="#contenido" className="skip-link">Saltar al contenido</a>
        <SiteHeader />
        <main id="contenido" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
