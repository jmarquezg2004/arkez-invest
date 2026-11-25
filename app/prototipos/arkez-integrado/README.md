# Vista previa integrada de Arkez

Ejecuta `ARKEZ_INDEXABLE=0 ARKEZ_LOCAL_PREVIEW=1 npm run build`, inicia `npm run preview` y abre `http://127.0.0.1:4173/prototipos/arkez-integrado/`. Los enlaces internos conservan los parámetros y anclas de las rutas que reutiliza la vista previa. Las descargas conservan su URL de archivo.

Usa el servidor local para revisar este export. Aplica la política de seguridad a cada página y mantiene `noindex`. El perfil de producción del sitio excluye las rutas integradas.

La encuesta está en `/prototipos/arkez-integrado/ruta-de-aprendizaje/`. Las respuestas viven en memoria del navegador y generan una ruta con recursos existentes.

La portada y Actualidad consultan titulares mediante `/api/noticias/preview` en el servidor local. El servidor usa las tres fuentes RSS del sitio anterior mediante RSS2JSON, conserva la lista durante cinco minutos y devuelve exclusivamente título, enlace, medio y fecha. Si la consulta falla, la selección editorial permanece disponible. En el export independiente sin servidor se muestra esa misma selección.

## Cloudflare Pages de prueba

El proyecto conectado a GitHub usa `npm run build` y el directorio `out`. Al detectar la URL de Cloudflare Pages de `arkez-invest-staging`, el build incluye automáticamente la vista integrada y el Worker. Para preparar una carga directa, compila el perfil local y ejecuta `node scripts/package-staging.mjs`. El directorio generado contiene los archivos y el Worker para subir al proyecto de prueba `arkez-invest-staging`. El Worker dirige la raíz a la portada integrada, sirve las noticias e impone `noindex` y la CSP por documento. Comprueba primero en Cloudflare que el proyecto de prueba no tenga el dominio principal vinculado. Con una sesión autorizada en esa cuenta, se puede cargar el contenido del directorio desde el proyecto o mediante `wrangler pages deploy <directorio> --project-name arkez-invest-staging --branch <rama-principal-del-proyecto-de-prueba>`. Para actualizar el subdominio fijo hay que verificar la rama principal de ese proyecto. Para crear solo una vista previa de rama, usa una rama distinta y conserva la URL devuelta por Cloudflare.

Explore y Research incorporan un gráfico gratuito servido por TradingView. La cobertura y el retraso dependen del mercado. La API local de consulta de empresas usa EDGAR de la SEC sin clave para localizar fichas y enlazar documentos recientes. Esos documentos solo existen para emisores cubiertos por EDGAR. El gráfico se carga al elegir un ticker y la CSP limita el marco a Explore y Research.
