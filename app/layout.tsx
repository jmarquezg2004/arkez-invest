import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./experience.css";
import "./innovation.css";
import "./motion.css";
import "./polish.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteDescription, siteName, siteUrl } from "@/lib/navigation";

const manrope = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--arkez-face",
  display: "swap",
  weight: "200 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Arkez Invest | Educación, formación y consultoría financiera", template: "%s | Arkez Invest" },
  description: siteDescription,
  applicationName: siteName,
  robots: process.env.ARKEZ_INDEXABLE === "1" ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { type: "website", siteName, locale: "es", description: siteDescription },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={manrope.variable}>
      <body>
        <a href="#contenido" className="skip-link">Saltar al contenido</a>
        <SiteHeader />
        <main id="contenido" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
