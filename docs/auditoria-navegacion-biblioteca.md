# Arkez Invest · Auditoría de navegación y biblioteca

## Enlaces corregidos

| Recorrido anterior | Destino y acción actual |
|---|---|
| Tarjetas de servicios y el acceso «Mercados e instrumentos» de la portada apuntaban a fragmentos del índice. | Las cuatro tarjetas abren su ficha. El enlace temático de mercados abre Análisis de Mercados. |
| El índice de servicios repetía el contenido y mezclaba enlaces a recursos con solicitudes. | Las secciones del índice presentan una síntesis y conducen a la ficha correspondiente. Los fragmentos anteriores siguen resolviendo para enlaces ya guardados. |
| El artículo de lectura de mercados reenviaba al fragmento que lo enlazaba. | El artículo desarrolla un caso con datos ficticios y enlaza su PDF. La ficha del servicio conduce al artículo como material de práctica. |
| La sección de escenarios reenviaba a riesgos, que remitía otra vez a escenarios. | El tutorial explica cómo usar el CSV y lo enlaza directamente. La guía incorpora además un caso de liquidez con solución y archivo. |
| Contacto enviaba de vuelta al índice de servicios o recursos. | La consulta conserva su acción y el enlace de privacidad. La ficha de origen preselecciona el servicio. |
| Recursos era un índice editorial sin búsqueda ni archivos. | La biblioteca incluye lectura en HTML, vista directa de PDF y descargas nativas enlazadas a archivos reales. |

La revisión distinguió enlaces repetidos de navegación global y accesos editoriales redundantes. Se conservaron los menús, el pie, el enlace para saltar al contenido y las anclas históricas. Se comprobaron 1.203 enlaces en el DOM de las 23 rutas exportadas y cinco destinos externos de fuentes públicas.

## Páginas y funcionalidades

Se conservaron las 20 URL originales. Se añadieron tres para que las cuatro líneas de servicio dispongan de ficha propia.

| Ficha | URL |
|---|---|
| Educación Financiera, ampliada | `/servicios/educacion-financiera/` |
| Análisis de Mercados | `/servicios/analisis-de-mercados/` |
| Formación Práctica | `/servicios/formacion-practica/` |
| Consultoría Financiera | `/servicios/consultoria-financiera/` |

Cada ficha describe la oferta, los beneficios, el público, la metodología, los contenidos y las preguntas frecuentes. Incluye un enlace a materiales pertinentes y una llamada a Contacto. Los títulos, descripciones y canónicas corresponden a cada URL. El marcado Service usa las fichas como destinos y la biblioteca incluye ItemList y MediaObject para los archivos disponibles.

La biblioteca en `/recursos/` busca por título, descripción y términos, sin distinguir tildes. El filtro por categoría se puede combinar con el buscador. Tiene recuento accesible, estado sin resultados y botón para limpiar filtros. El listado y los enlaces se sirven en HTML estático y se pueden usar sin JavaScript. Los filtros se aplican en el navegador.

## Recursos creados y ampliados

| Recurso | Leer en la web | Archivo |
|---|---|---|
| Lista de comprobación para invertir | `/recursos/guias/primeros-pasos/` | `/recursos/archivos/primeros-pasos-para-invertir.pdf` |
| Plantilla editable de escenarios con datos ficticios y filas en blanco | `/recursos/guias/#comparar-escenarios` | `/recursos/archivos/plantilla-escenarios.csv` |
| Caso guiado de análisis de mercados | `/recursos/articulos/#lectura-de-mercados` | `/recursos/archivos/lectura-de-mercados.pdf` |
| Caso de liquidez operativa | `/recursos/guias/#liquidez-operativa` | `/recursos/archivos/liquidez-operativa.pdf` |
| Diversificación, artículo incluido en el catálogo | `/recursos/articulos/que-es-diversificar/` | Lectura web |
| Inflación, artículo incluido en el catálogo | `/recursos/articulos/#inflacion` | Lectura web |

Los PDF contienen texto seleccionable y tienen una ruta de lectura web. La fuente de los PDF está en `lib/worksheets.json`. Se pueden regenerar con `python scripts/generate-resource-pdfs.py` en un entorno con ReportLab. El build del sitio utiliza los archivos versionados y no requiere Python.

## Pruebas

- Compilación, comprobación de tipos y 19 pruebas automatizadas. Se probaron tanto el perfil de prueba con `noindex` como el export local de producción.
- Chromium recorrió 23 páginas en siete anchos sin desbordamiento. La auditoría axe-core no encontró infracciones en las reglas A/AA evaluadas. Probé teclado, menú móvil, FAQ, búsqueda sin tildes, filtros combinados, estado vacío, limpieza y selección de los cuatro servicios en Contacto.
- Las cuatro descargas se iniciaron con teclado. El nombre y los bytes descargados coincidieron con los archivos compilados. Los tres enlaces PDF devolvieron HTTP 200 con MIME correcto. Poppler abrió y extrajo texto de los tres. El CSV devolvió `text/csv` y contiene filas editables.
- La revisión por patrones no encontró coincidencias de credenciales en los archivos y el historial examinados. La prueba de Contacto transmitió sólo un token técnico y un indicador antispam.
- Se comprobó que los cinco enlaces editoriales externos seguían resolviendo. Son páginas de Investor.gov y del Banco de la República.

## Pendientes de autorización o información

Confirmar los canales corporativos y las condiciones comerciales que aún requieren datos empresariales, como tarifas, disponibilidad y modalidades concretas. Para activar captación real se requieren autorización, destinatarios, política de privacidad, retención y credenciales en el servidor. La publicación y cualquier modificación de dominio o DNS se aprueban por separado.
