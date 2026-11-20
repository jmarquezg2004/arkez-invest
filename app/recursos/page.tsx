import { ContentPage } from "@/components/content-page";
import { ResourceLibrary } from "@/components/resource-library";
import { StructuredData } from "@/components/structured-data";
import { pages } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const path = "/recursos/";
const page = pages[path];

export const metadata = pageMetadata(path);

export default function ResourcesPage() {
  return (
    <>
      <StructuredData page={page} path={path} />
      <ContentPage page={page} path={path}><ResourceLibrary /></ContentPage>
    </>
  );
}
