/** Copy original de la landing (auditado contra novus-post/docs/context/). Fuente de los valores iniciales. */
import type {
  LandingComparisonRow,
  LandingConfig,
  LandingFeature,
  LandingFaq,
  LandingProductCapability,
  LandingProductGroup,
  LandingProductVariety,
  LandingScreenshot,
  LandingSectionId,
  LandingSectionState,
} from './types'

export const SECTION_ORDER: LandingSectionId[] = ['features', 'products', 'comparison', 'pricing', 'faq', 'finalCta']

export const SECTION_LABELS: Record<LandingSectionId, string> = {
  features: 'Características',
  products: 'Productos',
  comparison: 'Comparativa',
  pricing: 'Precios',
  faq: 'Preguntas frecuentes',
  finalCta: 'Cierre y descarga',
}

/** Iconos y tonos fijos: el dueño edita textos, no la identidad visual de cada tarjeta. */
export const FEATURE_VISUALS = [
  { icon: 'point_of_sale', iconTone: 'primary', badgeTone: 'primary' },
  { icon: 'table_view', iconTone: 'secondary', badgeTone: 'secondary' },
  { icon: 'history_edu', iconTone: 'neutral', badgeTone: 'neutral' },
  { icon: 'account_balance_wallet', iconTone: 'neutral', badgeTone: 'neutral' },
  { icon: 'balance', iconTone: 'primary', badgeTone: 'primary' },
  { icon: 'badge', iconTone: 'secondary', badgeTone: 'secondary' },
] as const

export const TRUST_BADGE_ICONS = ['terminal', 'storage', 'wifi_off', 'verified'] as const

export const PRODUCT_GROUP_VISUALS = [
  { icon: 'shopping_bag', iconTone: 'primary' },
  { icon: 'scale', iconTone: 'secondary' },
  { icon: 'style', iconTone: 'neutral' },
  { icon: 'inventory_2', iconTone: 'primary' },
] as const

export const PRODUCT_CAPABILITY_ICONS = [
  'qr_code_2',
  'payments',
  'local_offer',
  'receipt_long',
  'calendar_month',
  'inventory',
] as const

export const FAQ_VISUALS = [
  { icon: 'database', iconTone: 'primary' },
  { icon: 'settings_input_hdmi', iconTone: 'secondary' },
  { icon: 'computer', iconTone: 'neutral' },
] as const

const defaultSections: LandingSectionState[] = SECTION_ORDER.map((id) => ({ id, visible: true }))

const defaultFeatures: LandingFeature[] = [
  {
    id: 'terminal-ventas',
    title: 'Terminal de Ventas',
    description:
      'Encuentra productos por nombre, código o código de barras y cobra en efectivo, tarjeta, mixto o crédito. Deja ventas en espera para retomarlas después y cambia de módulo con un atajo sin perder el ritmo.',
    badge: '⚡ Búsqueda rápida y cobro sin complicaciones',
  },
  {
    id: 'inventario',
    title: 'Inventario claro y al día',
    description:
      'Consulta existencias y precios en una tabla fácil de leer. Registra entradas de mercancía, mermas y prepara etiquetas desde la misma pantalla, sin perder el historial de tus productos.',
    badge: '📦 Importa y exporta tu catálogo desde Excel o CSV',
  },
  {
    id: 'kardex',
    title: 'Historial de cada producto',
    description:
      'Cada entrada, salida, venta o devolución queda registrada con fecha, usuario y motivo. Consulta el historial completo de tus productos y expórtalo a Excel o PDF cuando lo necesites.',
    badge: '🛡 Información clara para tu auditoría',
  },
  {
    id: 'corte-z',
    title: 'Cierre de caja sin sorpresas',
    description:
      'Compara lo que debería haber en tu caja con lo que contaste y ve de inmediato si hay sobrante o faltante. Incluye ventas, abonos, ingresos y gastos del turno para que cierres con tranquilidad.',
    badge: '💰 Cuadratura clara en cada turno',
  },
  {
    id: 'basculas',
    title: 'Básculas conectadas',
    description:
      'Toma el peso directamente en la venta, sin digitar los gramos. Compatible con básculas Torrey, Rhino y Dibal; la conexión se configura una sola vez y queda lista para cada venta por kilo.',
    badge: '⚖ Peso automático para ventas por kilo',
  },
  {
    id: 'creditos',
    title: 'Clientes y créditos',
    description:
      'Conoce de un vistazo el saldo, el límite y los abonos de quienes compran a crédito. Los pagos se aplican a las deudas más antiguas y se reflejan de inmediato en la caja de tu turno.',
    badge: '💳 Cobros visibles al instante en tu caja',
  },
]

const defaultComparisonRows: LandingComparisonRow[] = [
  {
    capacity: 'Trabajo sin internet',
    novuspos: '✓ Cobra y consulta tu catálogo aunque no haya conexión',
    web: '× Depende de la conexión para cobrar',
  },
  {
    capacity: 'Velocidad al buscar productos',
    novuspos: '✓ Encuentra productos al instante en tu computadora',
    web: '× Depende de la velocidad de la red',
  },
  {
    capacity: 'Básculas conectadas',
    novuspos: '✓ Toma el peso de tu báscula sin digitarlo',
    web: '× Requiere equipos adicionales o no es compatible',
  },
  {
    capacity: 'Tickets y documentos de venta',
    novuspos: '✓ Tickets en 80 mm, 58 mm o carta, listos para descargar',
    web: 'Abre una ventana de impresión del navegador',
  },
  {
    capacity: 'Precio de la suscripción',
    novuspos: 'Mensual $4.99 USD o anual $59.99 USD (1er mes gratis)',
    web: '$29 a $79 USD / mes + cobros por terminal',
  },
]

const defaultProductGroups: LandingProductGroup[] = [
  {
    title: 'Lo de todos los días',
    description:
      'Abarrotes, refrescos, lácteos, panadería, limpieza, cuidado personal, frutas y verduras. Las categorías más comunes ya están listas y también puedes crear las tuyas. Si le subes una foto al producto, aparece en la tabla; si no, el programa le pone una letra con su color.',
    example: 'Arroz, aceite, gaseosas, leche, pan, detergente, shampoo, manzanas.',
  },
  {
    title: 'Por pieza, por caja o por peso',
    description:
      'Hay artículos que se cuentan y otros que se pesan. Trabajas con piezas, cajas y paquetes, o con kilogramos y litros cuando vendes a granel. En esos casos la cantidad admite fracciones: 1,450 kg se cobra por 1,450 kg, no por dos.',
    example: 'Aguacate 1,450 kg • caja de 12 refrescos • detergente por litro.',
  },
  {
    title: 'Tallas, colores y presentaciones',
    description:
      'Un producto puede tener varias versiones. Defines los atributos una sola vez y cada versión guarda su propio código, precio y existencia. En el carrito aparece la versión que elegiste; la ficha general no se cobra por error.',
    example: 'Camiseta talla M azul • botella de 600 ml • botella de 1,5 L.',
  },
  {
    title: 'Combos, servicios e insumos',
    description:
      'Arma paquetes con lo que ya vendes —pan con jamón y queso, shampoo con jabón— y el sistema calcula cuántos puedes preparar con el stock disponible. Al cobrar, descuenta cada producto del paquete. También caben servicios que no consumen existencias e insumos que usas en tu producción.',
    example: 'Combo desayuno • envío a domicilio • materia prima para tu negocio.',
  },
]

const defaultProductVarieties: LandingProductVariety[] = [
  { category: 'Bebidas', items: ['Gaseosa 600 ml', 'Agua mineral', 'Jugo de naranja', 'Cerveza 355 ml'] },
  { category: 'Lácteos y huevos', items: ['Leche 1 L', 'Queso panela', 'Yogur griego', 'Huevo 12 piezas'] },
  { category: 'Despensa', items: ['Arroz 1 kg', 'Frijol 1 kg', 'Aceite 850 ml', 'Atún 140 g', 'Pasta 200 g', 'Café soluble'] },
  { category: 'Snacks y dulces', items: ['Papas fritas', 'Galletas Marías', 'Chocolate', 'Cacahuates'] },
  { category: 'Panadería', items: ['Pan de caja', 'Pan integral', 'Medias noches', 'Donas', 'Pan tostado'] },
  { category: 'Limpieza', items: ['Detergente 1 kg', 'Suavizante', 'Cloro', 'Papel higiénico', 'Servilletas'] },
  { category: 'Cuidado personal', items: ['Jabón de tocador', 'Shampoo 400 ml', 'Pasta dental', 'Desodorante', 'Rastrillos'] },
  { category: 'Frutas y verduras', items: ['Manzana', 'Plátano', 'Jitomate', 'Aguacate', 'Limón'] },
]

const defaultProductCapabilities: LandingProductCapability[] = [
  {
    title: 'Códigos de barras',
    description: 'Puedes guardar más de un código por producto y encontrarlo con el lector. Las etiquetas salen en el tamaño que elijas.',
  },
  {
    title: 'Costo y ganancia',
    description: 'Entras el costo y el porcentaje de ganancia y el precio de venta se calcula solo. Si quieres redondear, lo cambias a mano.',
  },
  {
    title: 'Precios por mayoreo',
    description: 'Defines rangos por cantidad. Si el cliente lleva varias piezas, el precio que corresponde aparece automáticamente en el carrito.',
  },
  {
    title: 'Impuestos por producto',
    description: 'Cada artículo tiene su tasa: general, reducida, exenta o la que uses en tu negocio. El desglose se ve en el ticket.',
  },
  {
    title: 'Lotes y caducidad',
    description: 'Registras lote y fecha de vencimiento. Los productos que vencen primero son los que se descuentan primero.',
  },
  {
    title: 'Existencias y avisos',
    description: 'Entradas de mercancía, mermas y stock mínimo. La tabla avisa cuando algo se está acabando.',
  },
]

const defaultFaqs: LandingFaq[] = [
  {
    id: 'sin-internet',
    question: '¿Puedo seguir trabajando si no hay internet?',
    answer:
      'Sí. Ventas, cobros y ajustes quedan registrados al momento y siguen disponibles cuando vuelves a abrir el programa. Puedes cobrar, consultar tu inventario y hacer tu corte sin depender de la conexión. Solo el acceso inicial, la recuperación de clave y las tasas de cambio necesitan internet.',
  },
  {
    id: 'bascula-tickets',
    question: '¿Puedo conectar mi báscula y tener mis tickets listos?',
    answer:
      'Sí. Puedes tomar el peso de básculas Torrey, Rhino y Dibal directamente en la venta, y descargar tus tickets en 80 mm, 58 mm o tamaño carta. Todo se configura desde la propia aplicación.',
  },
  {
    id: 'requisitos',
    question: '¿Qué necesito para empezar?',
    answer:
      'NovusPOS funciona en Windows 10 y Windows 11 (en computadoras de 64 bits), así que no necesitas la versión más reciente para empezar. Solo necesitas internet para descargar el instalador e iniciar sesión la primera vez; después puedes trabajar sin conexión. El programa se abre maximizado y funciona cómodamente desde 960 × 600 px.',
  },
]

const defaultScreenshots: LandingScreenshot[] = [
  {
    src: '/imagen/novusposventa.png',
    alt: 'Terminal de ventas NovusPOS Desktop: catálogo, carrito, báscula conectada y cobro rápido',
    fit: 'contain',
  },
  {
    src: '/imagen/novuspos_producto.png',
    alt: 'Módulo de productos NovusPOS Desktop: catálogo e inventario con stock y precios',
    fit: 'contain',
  },
  {
    src: '/imagen/novuspos_kardex.png',
    alt: 'Módulo de Kardex NovusPOS Desktop: auditoría y trazabilidad de movimientos de inventario',
    fit: 'contain',
  },
  {
    src: '/imagen/novus_caja.png',
    alt: 'Módulo de caja NovusPOS Desktop: turno, arqueo de efectivo y corte Z',
    fit: 'cover',
  },
  {
    src: '/imagen/novus_cliente.png',
    alt: 'Módulo de clientes NovusPOS Desktop: directorio, créditos y abonos',
    fit: 'contain',
  },
]

/** Estado inicial completo; es inmutable y sirve para restaurar la landing original. */
export const LANDING_DEFAULTS: LandingConfig = {
  theme: {
    primary: '#003ec7',
    primaryContainer: '#0052ff',
    secondary: '#006c49',
    surface: '#f7f9fb',
    onSurface: '#191c1e',
  },
  sections: defaultSections,
  screenshots: defaultScreenshots,
  copy: {
    header: {
      features: 'Características',
      products: 'Productos',
      pricing: 'Precios',
      docs: 'Documentación',
      login: 'Iniciar Sesión',
    },
    hero: {
      headlineLead: 'El punto de venta para Windows que tu negocio necesita: ',
      headlineAccent: 'rápido, confiable',
      headlineTail: ' y siempre disponible',
      sloganLabel: 'Lema oficial:',
      slogan: 'NovusPOS — Diseñado para crecer contigo',
      description:
        'Cobra, controla tu inventario y cierra tu caja desde una sola aplicación. Todo queda registrado al momento y sigue disponible cuando vuelves a abrir el programa, incluso sin conexión. Además: básculas conectadas, tickets listos para imprimir o descargar y productos que encuentras al instante.',
      primaryCta: 'Descargar para Windows',
      primaryCtaNote: '30 días gratis • sin tarjeta',
      secondaryCta: 'Ver capturas del sistema',
      trustBadges: [
        'Instalador para Windows',
        'Tu información siempre disponible',
        'Trabaja sin internet',
        'Primer mes $0 USD',
      ],
    },
    features: {
      eyebrow: 'PENSADO PARA TU DÍA A DÍA',
      title: 'Todo para vender, controlar tu inventario y cerrar el día con confianza',
      description:
        'Olvídate de páginas lentas y de depender de la conexión para cobrar. NovusPOS trabaja desde tu computadora y te acompaña incluso cuando no hay internet.',
      items: defaultFeatures,
    },
    products: {
      eyebrow: 'CATÁLOGO DE PRODUCTOS',
      title: 'Cualquier producto tiene su lugar aquí',
      description:
        'Abarrotes, ropa, comida por peso, paquetes o servicios. Te contamos cómo puedes darlos de alta y qué datos guarda cada uno para que cobrar sea rápido.',
      catalogTitle: 'Así se ve el catálogo de un abasto',
      catalogDescription:
        'Productos con nombre y medida, tal como los pones en su ficha. Puedes tener todos estos a la vez y seguir agregando los tuyos.',
      capabilitiesTitle: 'Cada ficha guarda lo que necesitas al cobrar',
      capabilitiesDescription:
        'Estos datos se llenan una sola vez y después aparecen donde hacen falta: al buscar el producto, en el carrito y en el ticket.',
      groups: defaultProductGroups,
      varieties: defaultProductVarieties,
      capabilities: defaultProductCapabilities,
    },
    comparison: {
      eyebrow: 'NOVUSPOS FRENTE A UN POS EN NUBE',
      title: '¿Por qué elegir NovusPOS para tu negocio?',
      description: '',
      capacityHeader: 'Capacidad Operativa',
      novusposHeader: 'NovusPOS Desktop',
      webHeader: 'Sistemas POS en Navegador Web',
      rows: defaultComparisonRows,
    },
    pricing: {
      eyebrow: 'PRECIO TRANSPARENTE • CERO SORPRESAS',
      title: 'Elige cómo quieres pagar',
      description:
        'Mes a mes si prefieres empezar con calma, o un solo pago al año si ya sabes que NovusPOS es para ti. Sin límites de artículos, costos ocultos ni comisiones sobre tus ventas.',
      compatibility: 'Para Windows 10 o Windows 11',
      benefits: [
        { strong: 'Instalación completa', rest: ' en tu computadora, lista para trabajar desde el primer día.' },
        { strong: 'Catálogo y ventas', rest: ' sin costos por volumen ni comisiones sobre tus ventas.' },
        { strong: 'Básculas conectadas', rest: ' y tickets en 80/58 mm listos para imprimir o descargar.' },
        { strong: 'Cierre de caja, control de efectivo', rest: ' e historial completo de movimientos.' },
        { strong: 'Soporte desde la propia aplicación', rest: ', sin salir del programa.' },
        { strong: 'Respaldos de tu información', rest: ' y restauración cuando lo necesites.' },
      ],
      cta: 'Descargar para Windows',
      ctaNote: '30 días gratis • sin tarjeta',
      footnote: 'No requerimos tarjeta de crédito para iniciar tu período de prueba en Windows.',
    },
    faq: {
      eyebrow: 'PREGUNTAS FRECUENTES',
      title: 'Todo lo que necesitas saber antes de instalar',
      description: '',
      items: defaultFaqs,
    },
    finalCta: {
      eyebrow: 'COMIENZA HOY MISMO EN MENOS DE 2 MINUTOS',
      title: 'Descarga NovusPOS Desktop y lleva el control total de tu negocio',
      description:
        'Instala el programa, agrega tus productos desde Excel o empieza a vender de inmediato. Diseñado para crecer contigo.',
      button: 'Descargar instalador de Windows',
      note: '30 días gratis • sin tarjeta',
    },
    footer: {
      description:
        'Diseñado para crecer contigo. Software de punto de venta para comercios que quieren vender, controlar su inventario y cerrar el día con confianza.',
      legal: '© 2026 NovusPOS Technologies Ltd. Todos los derechos reservados.',
      status: 'Tu negocio, siempre disponible',
      currency: 'Moneda: USD ($4.99/mes)',
      columns: [
        { title: 'Producto', links: ['Punto de Venta', 'Básculas y periféricos', 'Cobro rápido', 'Planes y precios'] },
        { title: 'Ayuda', links: ['Guía de uso', 'Centro de ayuda', 'Novedades', 'Preguntas frecuentes'] },
        { title: 'Legal', links: ['Política de Privacidad', 'Términos del Servicio', 'Licencia de uso', 'Protección de datos'] },
      ],
    },
  },
}
