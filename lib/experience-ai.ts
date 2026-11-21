export const aiNodes = [
  { id: "gpu", title: "Cómputo", product: "NVIDIA H100", note: "Los aceleradores aportan capacidad de cálculo para entrenar o ejecutar modelos." },
  { id: "cloud", title: "Nube", product: "AWS y Google Cloud", note: "La nube ofrece infraestructura y opciones de despliegue. Cada proveedor documenta sus propios servicios." },
  { id: "engine", title: "Inferencia", product: "vLLM", note: "Un servidor de inferencia ejecuta el modelo y entrega respuestas a quienes lo consultan." },
  { id: "app", title: "Aplicaciones", product: "Cliente API", note: "Una aplicación llama a la interfaz del servidor para usar la respuesta en un proceso propio." },
] as const;

export const aiRelations = [
  {
    from: "gpu", to: "cloud", label: "H100 en Amazon EC2 P5",
    explanation: "AWS especifica aceleradores NVIDIA H100 en instancias EC2 P5.",
    url: "https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html",
    source: "Especificaciones de Amazon EC2",
  },
  {
    from: "cloud", to: "engine", label: "vLLM en Google Cloud",
    explanation: "Google Cloud documenta cómo implementar modelos abiertos usando vLLM en su plataforma.",
    url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/open-models/vllm/use-vllm",
    source: "Guía de Google Cloud para vLLM",
  },
  {
    from: "engine", to: "app", label: "Clientes mediante una API compatible",
    explanation: "vLLM expone un servidor HTTP compatible con la API de OpenAI. Es una interfaz técnica que un cliente puede usar.",
    url: "https://docs.vllm.ai/en/stable/serving/openai_compatible_server/",
    source: "Documentación del servidor vLLM",
  },
] as const;
