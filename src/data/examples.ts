/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusinessModelCanvas, CanvasBlockId, BMCBlockConfig } from '../types';

export const BUSINESS_EXAMPLES: { name: string; description: string; canvas: BusinessModelCanvas }[] = [
  {
    name: "SaaS de IA para Restaurantes",
    description: "Plataforma de software que utiliza inteligencia artificial para predecir la demanda de ingredientes, optimizar menús y automatizar compras en restaurantes de mediano tamaño.",
    canvas: {
      id: "example-saas",
      projectName: "RestoMind AI",
      description: "Optimización inteligente de inventarios y menús para restaurantes mediante IA para reducir el desperdicio de comida en un 30%.",
      keyPartnerships: [
        { id: "kp-1", text: "Proveedores de sistemas POS (Sistemas de Punto de Venta)" },
        { id: "kp-2", text: "Asociaciones y gremios gastronómicos locales" },
        { id: "kp-3", text: "Proveedores de infraestructura en la nube (AWS/Google Cloud)" }
      ],
      keyActivities: [
        { id: "ka-1", text: "Desarrollo y entrenamiento del algoritmo predictivo" },
        { id: "ka-2", text: "Soporte técnico continuo e integración de APIs con sistemas de pago y POS" },
        { id: "ka-3", text: "Marketing digital B2B y consultoría de onboarding para nuevos restaurantes" }
      ],
      keyResources: [
        { id: "kr-1", text: "Desarrolladores de software y científicos de datos expertos en IA" },
        { id: "kr-2", text: "Servidores en la nube y bases de datos seguras" },
        { id: "kr-3", text: "Metodologías de optimización gastronómica registradas" }
      ],
      valuePropositions: [
        { id: "vp-1", text: "Reducción del 30% en el desperdicio de ingredientes mediante predicción de demanda" },
        { id: "vp-2", text: "Optimización dinámica de precios de menús basada en costos en tiempo real" },
        { id: "vp-3", text: "Ahorro de hasta 15 horas semanales de trabajo manual en compras y pedidos" }
      ],
      customerRelationships: [
        { id: "cr-1", text: "Soporte personalizado premium (Chat y videollamadas 24/7)" },
        { id: "cr-2", text: "Onboarding guiado con un especialista para los primeros 30 días" },
        { id: "cr-3", text: "Boletines mensuales con consejos de eficiencia y reportes automáticos" }
      ],
      channels: [
        { id: "ch-1", text: "Fuerza de ventas directa (Outbound) dirigida a dueños de restaurantes" },
        { id: "ch-2", text: "Sitio web interactivo con demostración gratuita en vivo" },
        { id: "ch-3", text: "Publicidad en LinkedIn e Instagram dirigida a gerentes de operaciones gastronómicas" }
      ],
      customerSegments: [
        { id: "cs-1", text: "Restaurantes independientes de tamaño mediano con más de 20 mesas" },
        { id: "cs-2", text: "Cadenas de restaurantes pequeñas (de 2 a 10 sucursales)" },
        { id: "cs-3", text: "Gerentes de cocina frustrados con la gestión manual de inventarios" }
      ],
      costStructure: [
        { id: "co-1", text: "Salarios del equipo de desarrollo de IA y soporte al cliente" },
        { id: "co-2", text: "Costos de servidores en la nube y procesamiento de datos" },
        { id: "co-3", text: "Gastos de marketing B2B y comisiones del equipo de ventas" }
      ],
      revenueStreams: [
        { id: "rv-1", text: "Suscripción mensual recurrente (Planes Base, Pro y Enterprise)" },
        { id: "rv-2", text: "Tarifa única de implementación y capacitación inicial" },
        { id: "rv-3", text: "Cobro adicional por reportes de auditoría de sostenibilidad del inventario" }
      ],
      createdAt: new Date().toISOString()
    }
  },
  {
    name: "Cafetería de Especialidad Ecológica",
    description: "Cafetería física con impacto social que comercializa café de especialidad comprado directamente a pequeños caficultores bajo comercio justo, con empaques 100% compostables.",
    canvas: {
      id: "example-coffee",
      projectName: "Origen Verde Café",
      description: "Cafetería de especialidad de residuo cero que conecta a productores de montaña con consumidores urbanos conscientes.",
      keyPartnerships: [
        { id: "kp-1", text: "Cooperativas de pequeños caficultores orgánicos de altura" },
        { id: "kp-2", text: "Diseñadores de empaques biodegradables y vajillas compostables" },
        { id: "kp-3", text: "Artistas locales para exposiciones y eventos culturales" }
      ],
      keyActivities: [
        { id: "ka-1", text: "Tostado artesanal y preparación experta de bebidas de café" },
        { id: "ka-2", text: "Control estricto de la cadena de suministro sostenible y residuo cero" },
        { id: "ka-3", text: "Organización de talleres de cata de café y sostenibilidad para la comunidad" }
      ],
      keyResources: [
        { id: "kr-1", text: "Local físico acogedor en zona urbana de alto tráfico peatonal" },
        { id: "kr-2", text: "Baristas certificados apasionados por el servicio y la ecología" },
        { id: "kr-3", text: "Máquinas de espresso profesionales de alta eficiencia energética" }
      ],
      valuePropositions: [
        { id: "vp-1", text: "Café de especialidad de puntaje +85 con trazabilidad total del agricultor a la taza" },
        { id: "vp-2", text: "Espacio de desconexión urbana con filosofía de residuo cero (Zero Waste)" },
        { id: "vp-3", text: "Garantía de comercio justo: pagamos hasta un 40% más que el precio de mercado a productores" }
      ],
      customerRelationships: [
        { id: "cr-1", text: "Atención personalizada ultra-cálida reconociendo a clientes habituales" },
        { id: "cr-2", text: "Club de fidelización digital con recompensas por traer taza propia" },
        { id: "cr-3", text: "Transparencia total mediante códigos QR en cada empaque que muestran la historia del productor" }
      ],
      channels: [
        { id: "ch-1", text: "Punto de venta físico principal (Experiencia multisensorial)" },
        { id: "ch-2", text: "Redes sociales visuales (Instagram y TikTok) enfocadas en estética y valores" },
        { id: "ch-3", text: "Tienda online de café en grano y accesorios para entrega a domicilio" }
      ],
      customerSegments: [
        { id: "cs-1", text: "Amantes del café de especialidad y exigentes con el sabor (Coffee Geeks)" },
        { id: "cs-2", text: "Profesionales urbanos conscientes del medio ambiente y ecologistas" },
        { id: "cs-3", text: "Teletrabajadores que buscan un ambiente acogedor y con buen internet" }
      ],
      costStructure: [
        { id: "co-1", text: "Alquiler y servicios públicos del local comercial" },
        { id: "co-2", text: "Compra de café verde directo, leches alternativas y suministros compostables" },
        { id: "co-3", text: "Sueldos competitivos y beneficios de los baristas" }
      ],
      revenueStreams: [
        { id: "rv-1", text: "Venta directa de bebidas calientes, frías y repostería artesanal local" },
        { id: "rv-2", text: "Venta de bolsas de café tostado para consumo doméstico (Suscripción disponible)" },
        { id: "rv-3", text: "Ingresos por talleres presenciales de barismo y catas los fines de semana" }
      ],
      createdAt: new Date().toISOString()
    }
  }
];

export const EMPTY_CANVAS = (id: string = "new-canvas"): BusinessModelCanvas => ({
  id,
  projectName: "",
  description: "",
  keyPartnerships: [],
  keyActivities: [],
  keyResources: [],
  valuePropositions: [],
  customerRelationships: [],
  channels: [],
  customerSegments: [],
  costStructure: [],
  revenueStreams: [],
  createdAt: new Date().toISOString()
});

export const CANVAS_BLOCKS_CONFIG: { [key in CanvasBlockId]: BMCBlockConfig } = {
  keyPartnerships: {
    id: "keyPartnerships",
    title: "Alianzas Clave",
    emoji: "🔗",
    description: "Socios y proveedores que hacen que el negocio funcione.",
    placeholder: "Ej: Cooperativas de agricultores locales, distribuidores...",
    questions: [
      "¿Quiénes son nuestros socios clave?",
      "¿Quiénes son nuestros proveedores clave?",
      "¿Qué recursos clave adquirimos de ellos?",
      "¿Qué actividades clave realizan nuestros socios?"
    ]
  },
  keyActivities: {
    id: "keyActivities",
    title: "Actividades Clave",
    emoji: "⚡",
    description: "Acciones críticas que el negocio debe realizar para tener éxito.",
    placeholder: "Ej: Desarrollo de software, tostado de granos, diseño de modas...",
    questions: [
      "¿Qué actividades requiere nuestra propuesta de valor?",
      "¿Y nuestros canales de distribución?",
      "¿Y nuestras relaciones con los clientes?",
      "¿Y nuestras fuentes de ingresos?"
    ]
  },
  keyResources: {
    id: "keyResources",
    title: "Recursos Clave",
    emoji: "🛠️",
    description: "Activos físicos, intelectuales, humanos y financieros indispensables.",
    placeholder: "Ej: Algoritmo de IA, servidores, baristas expertos...",
    questions: [
      "¿Qué recursos requiere nuestra propuesta de valor?",
      "¿Y nuestros canales de distribución?",
      "¿Y nuestras relaciones con los clientes?",
      "¿Y nuestras fuentes de ingresos?"
    ]
  },
  valuePropositions: {
    id: "valuePropositions",
    title: "Propuesta de Valor",
    emoji: "🎁",
    description: "El conjunto de productos y servicios que crean valor para cada segmento.",
    placeholder: "Ej: Ahorro de tiempo en cocina, café artesanal de comercio justo...",
    questions: [
      "¿Qué valor entregamos al cliente?",
      "¿Qué problemas de nuestros clientes ayudamos a resolver?",
      "¿Qué necesidades estamos satisfaciendo?",
      "¿Qué productos o servicios ofrecemos a cada segmento?"
    ]
  },
  customerRelationships: {
    id: "customerRelationships",
    title: "Relaciones con Clientes",
    emoji: "❤️",
    description: "El tipo de relación que establecemos con cada segmento de clientes.",
    placeholder: "Ej: Soporte premium 24/7, club de beneficios digitales...",
    questions: [
      "¿Qué tipo de relación espera cada segmento que establezcamos?",
      "¿Cuáles hemos establecido?",
      "¿Cómo se integran en el resto de nuestro modelo de negocio?",
      "¿Cuánto nos cuestan?"
    ]
  },
  channels: {
    id: "channels",
    title: "Canales",
    emoji: "🚚",
    description: "Cómo nos comunicamos y entregamos la propuesta de valor.",
    placeholder: "Ej: Fuerza de ventas B2B, local comercial céntrico...",
    questions: [
      "¿A través de qué canales quieren ser contactados nuestros clientes?",
      "¿Cómo los contactamos ahora?",
      "¿Cómo están integrados nuestros canales?",
      "¿Cuáles funcionan mejor? ¿Cuáles son más rentables?"
    ]
  },
  customerSegments: {
    id: "customerSegments",
    title: "Segmentos de Clientes",
    emoji: "👥",
    description: "Los diferentes grupos de personas o entidades a los que nos dirigimos.",
    placeholder: "Ej: Restaurantes medianos, profesionales urbanos conscientes...",
    questions: [
      "¿Para quién estamos creando valor?",
      "¿Quiénes son nuestros clientes más importantes?",
      "¿Cuáles son sus características demográficas y de comportamiento?"
    ]
  },
  costStructure: {
    id: "costStructure",
    title: "Estructura de Costos",
    emoji: "💰",
    description: "Todos los costos incurridos para operar el modelo de negocio.",
    placeholder: "Ej: Servidores cloud, nómina del equipo, alquiler del local...",
    questions: [
      "¿Cuáles son los costos más importantes inherentes a nuestro modelo?",
      "¿Qué recursos clave son los más costosos?",
      "¿Qué actividades clave son las más costosas?"
    ]
  },
  revenueStreams: {
    id: "revenueStreams",
    title: "Fuentes de Ingresos",
    emoji: "💵",
    description: "Cómo genera dinero la empresa con cada segmento de clientes.",
    placeholder: "Ej: Suscripción mensual recurrente, venta de café al detalle...",
    questions: [
      "¿Por qué valor están realmente dispuestos a pagar nuestros clientes?",
      "¿Por qué pagan actualmente?",
      "¿Cómo pagan actualmente?",
      "¿Cómo preferirían pagar?",
      "¿Cuánto aporta cada fuente de ingresos al total?"
    ]
  }
};
