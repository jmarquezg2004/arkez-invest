# Origen de la adaptación

El código de referencia corresponde a [Hirael NexaCore, revisión 73e8994](https://github.com/MohammadShehadeh/hirael/tree/73e89944d120648083fdd42e219dc95ecd8eda56/registry/hirael/bases/radix/templates/nexacore), de Mohammad Shehadeh, con licencia MIT. La licencia se conserva en este directorio.

| Archivo de origen | Adaptación |
| --- | --- |
| `primitives.tsx` | Hook `useScrolled` para la navegación flotante |
| `hero.tsx` | Capas de imagen, contraste y contenido centrado a pantalla completa |
| `service-card.tsx` | Movimiento de la ilustración y revelado de contenido, con controles accesibles |
| `precision.tsx` | Secuencia de cuatro pasos en escalera y composición móvil |

La imagen arquitectónica es original, generada para este prototipo. Las demostraciones de Arkez reutilizan las fórmulas de interés compuesto y las relaciones de infraestructura IA documentadas en el repositorio.

## Tokens del prototipo V2

- Base arquitectónica: azul marino `#09121e`, blanco cálido `#f7f5f0`, tinta `#111c2d` y dorado `#ecce94` para énfasis.
- Superficies de lectura: marfil `#fbfaf4`, niebla `#edf1ec` y verde `#1c644f` para la serie principal. Bronce discontinuo y azul punteado distinguen las series adicionales.
- Espaciado: múltiplos de un cuarto de rem para controles; la composición editorial usa `clamp` para márgenes, bandas y títulos. Manrope conserva la misma escala editorial que V1.
- Interacción: contorno de foco de 2 px y áreas de 44 px en los principales controles. Los módulos claros usan una sombra tenue `--nx-lift`.
- Movimiento: `--nx-ease` para cambios de composición de ~450 ms; Motion para reorganizar fuentes y escenas. Los controles manuales funcionan con movimiento reducido y los gráficos omiten la interpolación.
