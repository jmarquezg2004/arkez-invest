# Biblioteca financiera de Arkez Invest

Edición del 20 de noviembre de 2026. Los importes, empresas y escenarios de los ejercicios son ficticios. Las referencias identifican la fuente conceptual.

| Recurso | Formato y nivel | URL relativa |
|---|---|---|
| Antes de invertir | PDF de 8 páginas · Inicial | `/recursos/archivos/primeros-pasos-para-invertir.pdf` |
| Cómo leer un movimiento de mercado | PDF de 8 páginas · Intermedio | `/recursos/archivos/lectura-de-mercados.pdf` |
| Liquidez operativa bajo presión | PDF de 8 páginas · Intermedio | `/recursos/archivos/liquidez-operativa.pdf` |
| Laboratorio financiero | XLSX de 6 hojas · Intermedio | `/recursos/archivos/laboratorio-financiero.xlsx` |

Los PDF incluyen portada institucional, índice enlazado, cinco casos con tablas y gráficos o diagramas, ejercicios con soluciones, conclusiones y enlaces a fuentes. La biblioteca conserva la vista PDF y la descarga. Las guías y artículos correspondientes ofrecen las ediciones completas en HTML, con tablas semánticas y los datos de los gráficos como texto. Los PDF contienen texto seleccionable e índices internos. La versión HTML es la alternativa semántica para tecnologías de asistencia.

El XLSX reúne Instrucciones, Presupuesto, Escenarios, Inversiones, Riesgo y Dashboard. Las celdas doradas contienen datos ficticios editables. Las azules se reservan para datos propios y las grises muestran resultados de fórmulas. El selector B4 del Dashboard cambia el origen de cuatro indicadores y cuatro series entre ambos conjuntos. El libro usa COP y porcentajes, validación de entradas y tablas independientes por conjunto. Carece de macros y conexiones externas.

La biblioteca muestra portadas, formato, extensión, nivel y fecha. El acceso «Ver contenido» del Excel abre el tutorial y una captura del Dashboard renderizada desde el archivo real.

## Regeneración y verificación

Para regenerar archivos y portadas en Linux se usan Python, ReportLab, PyMuPDF, Pillow, XlsxWriter y DejaVu Sans. El build web copia los binarios versionados y funciona sin instalar estas herramientas.

```sh
python scripts/generate-resource-pdfs.py
python scripts/generate-resource-xlsx.py
soffice --headless --convert-to pdf --outdir /tmp public/recursos/archivos/laboratorio-financiero.xlsx
python scripts/generate-resource-xlsx.py --dashboard-pdf /tmp/laboratorio-financiero.pdf
python scripts/verify-financial-resources.py
npm run build
npm run typecheck
npm test
```

La verificación financiera requiere también openpyxl y LibreOffice Calc. Compara las 139 fórmulas con un recálculo independiente, modifica los datos en ambos modos y comprueba las series y el render de los gráficos. La revisión PDF verifica las 24 páginas, la ubicación del texto y los enlaces del índice y las fuentes.

Las cuatro descargas se comprobaron en Cloudflare Pages local mediante Wrangler. Cada una devolvió HTTP 200, MIME correcto, `noindex` y el mismo contenido del build. Queda pendiente repetir la prueba en una URL de staging de Cloudflare habilitada para el proyecto.
