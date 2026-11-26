# Arkez Visual Stories

Línea editorial complementaria para explicar conceptos financieros, económicos y tecnológicos mediante ilustraciones, humor discreto y narrativas visuales. Su principio rector es comunicar con creatividad sin perder rigor, elegancia ni credibilidad financiera.

## Cuándo usarla

Úsala en publicaciones y carruseles educativos de Instagram y LinkedIn, reels, historias, microanimaciones, recursos interactivos y piezas conceptuales seleccionadas de Explore. La escena debe ayudar a entender una idea, visualizar una relación o recordar una pregunta útil.

Reserva el diseño institucional aprobado para informes financieros, documentos corporativos, reportes de Research, análisis de empresas, gráficos financieros y presentaciones institucionales. La guía se aplica a nuevas piezas editoriales.

## Dirección artística

- Toma de la historieta clásica de periódico la claridad de las viñetas, el ritmo de lectura y la expresividad contenida. Usa contornos definidos de grosor medio en azul marino o negro, rellenos planos y sombras simples. Mantén el papel cálido y la textura discreta.
- Usa azul marino para los contornos y marfil para globos y zonas de lectura. Amplía la paleta con turquesa, azul cielo, verde hoja, coral y mostaza. Elige uno o dos colores dominantes para cada escena y conserva el color del personaje y de sus objetos entre viñetas. Reserva los tonos más saturados para la acción principal o el remate.
- Crea personajes originales y reconocibles. Registra para cada personaje su silueta, proporciones, vestuario y expresiones clave. Reutiliza esos rasgos en las siguientes piezas y conserva la continuidad de objetos, luz y escenario entre viñetas.
- Sitúa los conceptos en escenas cotidianas y usa objetos que hagan visible la idea. Mantén las expresiones naturales y la composición adulta y sobria. Deja el espacio necesario para leer y usa globos con una frase breve, separados de la ilustración para conservar contraste y legibilidad.
- Trabaja con una sola idea central por secuencia. En tres o cuatro viñetas, presenta la situación, muestra qué cambia y cierra con una consecuencia clara o un remate que ayude a recordarla. Si hay cifras ilustrativas, identifícalas. Si hay afirmaciones que requieren sustento, acompáñalas de una fuente verificable.

### Referencia artística

Las referencias incluyen tiras de periódico y un cómic contemporáneo de contorno marcado, color plano y globos de una sola frase. Toma de ellas la economía de texto, la progresión entre escenas y el contraste expresivo entre el planteamiento y el remate. Crea personajes, acciones, diálogos y escenarios propios de Arkez.

## Movimiento y accesibilidad

- Anima la acción que explica el concepto. Usa cambios de expresión, desplazamientos cortos de objetos, profundidad por capas y transiciones suaves entre viñetas. Conserva posiciones, escala y luz entre escenas consecutivas.
- En web, respeta `prefers-reduced-motion` ofreciendo la secuencia estática en el mismo orden y con el contenido completo. Si la animación se reproduce automáticamente y dura más de cinco segundos, ofrece un control para pausarla. Las acciones interactivas deben poder usarse con teclado.
- Entrega texto alternativo o una transcripción ordenada por viñeta cuando la secuencia transmita información. Añade subtítulos a los videos con diálogo o narración. Para web, prioriza texto HTML separado de la ilustración y contrasta los textos sobre fondos uniformes.

## Formatos

| Destino | Proporción y entrega | Composición |
| --- | --- | --- |
| Publicación o carrusel de Instagram | 3:4, por ejemplo 1080 × 1440 px por pieza | Distribuye texto y elementos importantes dentro de márgenes seguros. Conserva el orden de lectura si cada viñeta se publica por separado. |
| Reel o historia | 9:16, por ejemplo 1080 × 1920 px | Reencuadra cada escena para la lectura vertical. Deja margen para los controles de la plataforma y los subtítulos. |
| Narrativa horizontal o video | 16:9, por ejemplo 1920 × 1080 px | Organiza las viñetas de izquierda a derecha o presenta una por plano. |
| Pieza web | SVG para trazos vectoriales propios, WebP para arte rasterizado, video comprimido con imagen de portada si corresponde | Exporta al tamaño de uso y comprueba la lectura en móvil. Mantén la imagen o secuencia estática como alternativa al movimiento. |

## Comandos creativos

Usa estos comandos como encabezado de un encargo seguido del tema, la audiencia, el formato y el objetivo de aprendizaje.

| Comando | Entrega | Ejemplo de encargo |
| --- | --- | --- |
| `/ARKEZCOMIC` | Historieta de tres o cuatro viñetas con guion, descripción visual y texto alternativo. | `/ARKEZCOMIC diferencia entre tener una factura emitida y haber cobrado, 16:9.` |
| `/ARKEZREEL` | Guion vertical por planos, con duración, acciones y subtítulos. | `/ARKEZREEL por qué el precio y el valor pueden diferir, 9:16.` |
| `/ARKEZMOTION` | Guion de animación con capas, acción principal, transiciones y versión estática. | `/ARKEZMOTION un cobro se retrasa y se desplaza en el calendario de caja, web.` |
| `/ARKEZCONCEPT` | Ilustración editorial con metáfora, composición y texto alternativo. | `/ARKEZCONCEPT la diferencia entre una foto del saldo y una película del flujo de caja, 16:9.` |
| `/ARKEZHUMOR` | Escena o tira breve con un remate que refuerce el concepto. | `/ARKEZHUMOR un presupuesto que cuenta dos veces el mismo ingreso, 3:4.` |
| `/ARKEZCAROUSEL` | Secuencia de piezas con una idea por lámina y continuidad visual. | `/ARKEZCAROUSEL cómo comprobar la fuente, la fecha y la unidad de una cifra, 3:4.` |

## Revisión antes de entregar

1. Comprueba qué aprende una persona al ver la pieza y si el remate respeta el concepto.
2. Revisa fuentes, fechas y unidades cuando se usen datos. Distingue de forma visible los ejemplos ilustrativos.
3. Comprueba la continuidad de personajes, el contraste, el orden de lectura y los recortes del formato final.
4. Prueba la alternativa estática y, donde aplique, los controles por teclado, subtítulos y cargas en móvil.

## Implementación web

En el prototipo integrado, **Explore y Research → Arkez Visual Stories** abre la colección dentro de Research. Cada tarjeta muestra un primer plano de su propia viñeta en formato 16:9 y lleva a la historia. Usa el estilo de ODDITY como referencia de personaje, contorno y contraste cromático para toda la colección. Cada pieza educativa enlaza a su guía, artículo o directorio para ampliar el tema.

Las viñetas se leen sin interacción y el movimiento se activa con un botón. Los cuatro reels de la colección conservan controles propios y se cargan al abrir el reproductor. Las ilustraciones WebP y los videos del prototipo se preparan para la compilación de revisión.
