import { ContactForm } from "@/components/contact-form";
import { ContentPage } from "@/components/content-page";
import { StructuredData } from "@/components/structured-data";
import { pages } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const path = "/contacto/";
const page = pages[path];

export const metadata = pageMetadata(path);

export default function ContactPage() {
  return (
    <>
      <StructuredData page={page} path={path} />
      <ContentPage page={page} path={path}><ContactForm /></ContentPage>
    </>
  );
}
