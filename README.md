# Arkez Invest

Sitio corporativo en español de Arkez Invest, empresa de educación, formación y consultoría financiera para personas y empresas. La vista previa incluye servicios, guías, artículos y preguntas frecuentes.

Las 20 URL originales se conservan. Las fichas de análisis de mercados, formación práctica y consultoría amplían el sitio a 23 rutas. La [auditoría de navegación y biblioteca](docs/auditoria-navegacion-biblioteca.md) documenta los cambios y las descargas.

## Ejecutar en local

Requiere Node.js 22 o posterior y npm.

```sh
npm ci
npm run dev
```

Abre `http://localhost:3000`. Para comprobar y servir la compilación estática:

```sh
npm run build
npm run typecheck
npm test
npm run preview
```

Abre `http://127.0.0.1:4173`. Esta vista sirve la exportación y el formulario de demostración. Usa «Usar datos de ejemplo» en Contacto. Puedes elegir otro puerto con `ARKEZ_PREVIEW_PORT`. El archivo `index.html` de la raíz se conserva como versión heredada estática. La salida de Next.js está en `out/`.

## Estructura

- `app/` contiene la portada, las rutas prerenderizadas, la 404 y los metadatos SEO.
- `components/` contiene navegación, pie, tarjetas y plantilla de páginas internas.
- `lib/` contiene el catálogo tipado, los servicios, la navegación y la ficha SEO de cada URL.
- `public/brand/` contiene el logotipo, la imagen social optimizada y la licencia tipográfica.
- `tests/` verifica la exportación estática, sus rutas, enlaces y límites de la vista previa.

La vista previa sale con `noindex` y con rastreo deshabilitado. `ARKEZ_INDEXABLE=1` se reserva para la compilación de una futura publicación autorizada. El sitio usa activos locales y contenidos de Git. El navegador valida los campos localmente. El servidor de prueba escucha en loopback y procesa únicamente una prueba aleatoria de un solo uso y un indicador antispam. Aplica origen estricto, tiempo mínimo, caducidad, límite de solicitudes y tamaño máximo. Ningún campo de la consulta se transmite ni se guarda y la vista no usa analítica. Estos controles son para la demostración local.

Las tres líneas de servicio sin ruta propia se publican como secciones enlazables dentro de `/servicios/`. El sitemap contiene las 20 URL canónicas. El catálogo SEO asigna términos por intención y el marcado Schema.org describe el contenido visible.

## Pendientes

- Confirmar canales y titularidad del contacto, identidad empresarial, integrantes del equipo y alcance comercial.
- Revisar los textos de privacidad, términos y riesgo antes de presentarlos como políticas definitivas.
- Autorizar la captación real, los destinatarios, la política de retención y un backend o proveedor. Antes de activarlo, revisar validación en servidor, controles antispam y gestión de datos.
- Configurar el alojamiento, cabeceras de seguridad, DNS y canonicalización con una aprobación de publicación separada.

## Preparación para producción

La [auditoría de seguridad](docs/seguridad-produccion.md) y el [procedimiento de publicación y reversión](docs/publicacion-reversion.md) documentan los cambios y autorizaciones. `npm run release -- production` prepara un artefacto local verificable con SHA-256. El adaptador de contacto de `deployment/` se mantiene desactivado y se configura por separado.
