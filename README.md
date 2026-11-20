# Arkez Invest

Sitio corporativo y educativo en español. La Fase 1 ofrece navegación multipágina, guías, artículos, preguntas frecuentes e información sobre el alcance del sitio.

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
python3 -m http.server --bind 127.0.0.1 --directory out 4173
```

Abre `http://127.0.0.1:4173`. El sitio necesita HTTP para resolver rutas y activos. El archivo `index.html` de la raíz se conserva como versión heredada estática. La salida de Next.js está en `out/`.

## Estructura

- `app/` contiene la portada, las rutas prerenderizadas, la 404 y los metadatos SEO.
- `components/` contiene navegación, pie, tarjetas y plantilla de páginas internas.
- `lib/` contiene el catálogo tipado de páginas, submenús y enlaces históricos.
- `public/brand/` contiene versiones optimizadas del logotipo y la imagen editorial ilustrativa.
- `tests/` verifica la exportación estática, sus rutas, enlaces y límites de la vista previa.

La vista previa sale con `noindex` y con rastreo deshabilitado. `ARKEZ_INDEXABLE=1` se reserva para la compilación de una futura publicación autorizada. El sitio usa activos locales y contenidos de Git. La página de contacto es informativa y carece de campos, servicios de envío y analítica.

## Pendientes

- Confirmar canales y titularidad del contacto, identidad empresarial, integrantes del equipo y alcance comercial.
- Revisar los textos de privacidad, términos y riesgo antes de presentarlos como políticas definitivas.
- Aprobar una integración de contacto con validación, antispam y retención.
- Configurar el alojamiento, cabeceras de seguridad, DNS y canonicalización con una aprobación de publicación separada.
