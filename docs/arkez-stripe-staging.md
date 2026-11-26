# Enlaces de Stripe de Arkez Research

Cada plan de pago único abre el resumen en `/prototipos/arkez-integrado/research/pedido/` con el plan seleccionado.

En Cloudflare Pages, configura estas variables de compilación en el proyecto de staging y vuelve a compilar.

| Variable | Plan |
| --- | --- |
| `NEXT_PUBLIC_ARKEZ_STRIPE_GUIDE_TEST` | Guía de comparación, USD 5 |
| `NEXT_PUBLIC_ARKEZ_STRIPE_WORKSHOP_TEST` | Taller autoguiado, USD 10 |

Usa enlaces públicos de Payment Links en modo de prueba con el formato `https://buy.stripe.com/test_…`. Verifica el importe y que el enlace en Stripe esté configurado para pago único. El resumen abre Stripe en otra pestaña. Ante un enlace ausente o inválido, muestra la simulación local.

Los valores son URLs públicas. Las claves privadas de la cuenta permanecen fuera de estas variables. Esta vista no acredita pagos, entrega accesos ni habilita suscripciones.
