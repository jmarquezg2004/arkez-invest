# Vista previa integrada de Arkez

Ejecuta `ARKEZ_INDEXABLE=0 ARKEZ_LOCAL_PREVIEW=1 npm run build`, inicia `npm run preview` y abre `http://127.0.0.1:4173/prototipos/arkez-integrado/`. Los enlaces internos conservan los parámetros y anclas de las rutas que reutiliza la vista previa. Las descargas conservan su URL de archivo.

Usa el servidor local para revisar este export. Aplica la política de seguridad a cada página y mantiene `noindex`. El perfil de producción del sitio excluye las rutas integradas.

La encuesta está en `/prototipos/arkez-integrado/ruta-de-aprendizaje/`. Las respuestas viven en memoria del navegador y generan una ruta con recursos existentes.

La portada y Actualidad consultan titulares mediante `/api/noticias/preview` en el servidor local. El servidor usa las tres fuentes RSS del sitio anterior mediante RSS2JSON, conserva la lista durante cinco minutos y devuelve exclusivamente título, enlace, medio y fecha. Si la consulta falla, la selección editorial permanece disponible. En el export independiente sin servidor se muestra esa misma selección.

## Cloudflare Pages de prueba

El proyecto conectado a GitHub usa `npm run build` y el directorio `out`. Al detectar la URL de Cloudflare Pages de `arkez-invest-staging`, el build incluye automáticamente la vista integrada y el Worker. Para preparar una carga directa, compila el perfil local y ejecuta `node scripts/package-staging.mjs`. El directorio generado contiene los archivos y el Worker para subir al proyecto de prueba `arkez-invest-staging`. El Worker dirige la raíz a la portada integrada, sirve las noticias e impone `noindex` y la CSP por documento. Comprueba primero en Cloudflare que el proyecto de prueba no tenga el dominio principal vinculado. Con una sesión autorizada en esa cuenta, se puede cargar el contenido del directorio desde el proyecto o mediante `wrangler pages deploy <directorio> --project-name arkez-invest-staging --branch <rama-principal-del-proyecto-de-prueba>`. Para actualizar el subdominio fijo hay que verificar la rama principal de ese proyecto. Para crear solo una vista previa de rama, usa una rama distinta y conserva la URL devuelta por Cloudflare.

Explore y Research incorporan un gráfico gratuito servido por TradingView. La cobertura y el retraso dependen del mercado. La API local de consulta de empresas usa EDGAR de la SEC sin clave para localizar fichas y enlazar documentos recientes. Esos documentos solo existen para emisores cubiertos por EDGAR. El gráfico se carga al elegir un ticker y la CSP limita el marco a Explore y Research.

### ISA e idioma

El prototipo usa el primer idioma compatible de la lista del navegador (ES o EN). El selector
guarda la elección explícita en almacenamiento local. Los textos ingleses revisados están
en `english.ts`. Si el navegador dispone del traductor local de ES a EN, el selector puede
completar el resto dentro del prototipo. Los documentos descargables y marcos externos
conservan el idioma de origen.

ISA busca primero en el catálogo bilingüe de `isa-knowledge.ts` dentro del navegador. Las
coincidencias se resuelven sin enviar la pregunta al servidor ni consumir tokens. Las
preguntas fuera del catálogo usan `/api/isa`, disponible con un binding `AI` **en el proyecto
de staging**. Ese endpoint envía la pregunta y un extracto visible del apartado al modelo
de Cloudflare. El código de Arkez no guarda la conversación. El límite de solicitudes del
Worker ayuda a contener el uso. La cuota de Cloudflare y el presupuesto se administran
por separado. El catálogo funciona con el binding desactivado.

Las consultas fuera del catálogo usan primero el modelo integrado del navegador cuando
el dispositivo lo tiene disponible. Si el servicio remoto falla y el navegador admite
una descarga, ISA ofrece iniciarla de forma explícita. Sin un modelo local compatible,
las preguntas abiertas dependen del binding `AI` de Cloudflare Pages. Las consultas
resueltas desde el catálogo o el modelo local no requieren una llamada a Workers AI.
