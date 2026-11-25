# Vista previa integrada de Arkez

Ejecuta `ARKEZ_INDEXABLE=0 ARKEZ_LOCAL_PREVIEW=1 npm run build`, inicia `npm run preview` y abre `http://127.0.0.1:4173/prototipos/arkez-integrado/`. Los enlaces internos conservan los parámetros y anclas de las rutas que reutiliza la vista previa. Las descargas conservan su URL de archivo.

Usa el servidor local para revisar este export. Aplica la política de seguridad a cada página y mantiene `noindex`. Los perfiles de Cloudflare y producción excluyen las rutas integradas.
