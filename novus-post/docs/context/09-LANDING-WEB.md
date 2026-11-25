# 🌐 NOVUSPOS — 09. LANDING WEB OFICIAL (`novuspos-front`)

> **Propósito para IAs:** Contexto del sitio web de marketing de NovusPOS. Carga este archivo cuando trabajes en `novuspos-front/`, además del `00-MASTER-CONTEXT.md`. Guía operativa completa: skill `novuspos-web-landing`.

---

## 1. Ficha técnica

- **Repositorio:** `novuspos-front/` (proyecto Vite independiente del shell Electron).
- **Stack:** Vite 8 · React 19 · TypeScript · Tailwind CSS v4 · Material Symbols Outlined (fuente local) · Plus Jakarta Sans + JetBrains Mono (**autoalojadas**).
- **Alias:** `@/*` → `src/*`.
- **Fuente visual (verdad):** Stitch `projects/14269822984035378146`, pantalla `screens/82fef7e6f4a148cabdc44a42ef4d5ac6` ("NovusPOS - Landing Page Oficial", 2560×10642).
  - HTML: `files/10532653372921472128` · Screenshot: `files/14233028886615310537` (1280×5351).
- **Sistema visual:** **Material Design 3** (azul `#003ec7`/`#0052ff`, verde `#006c49`), **NO** Fluent. No mezclar con el escritorio.

> ⚠️ **Excepción actual (pedido explícito):** el hero ya no usa el mockup HTML de Stitch; muestra capturas reales del sistema en un carrusel apilado con el efecto de `nexusposgobal.com`. Ver §5.

> 🛑 **El screenshot de Stitch NO sirve como referencia tipográfica.** Su renderizador no cargó Google Fonts: todo el texto sale en **Times New Roman** (verificado ampliando el bitmap 4×). Por eso los saltos de línea y algunas alturas del screenshot no coinciden con el diseño real. La verdad son el **HTML + `tailwind.config` embebido**.

---

## 2. Estructura implementada (réplica exacta de Stitch)

```text
src/
├── App.tsx                            # enrutado por pathname: /auth | /auth/login → AuthPage; /panel → PanelPage
├── app/LandingPage.tsx                # SiteHeader + <main class="pt-20"> + secciones + Footer
├── app/AuthPage.tsx                   # split de auth (5/7) + barra inferior de confianza
├── shared/
│   ├── ui/MS.tsx                      # icono Material Symbols (filled opcional)
│   └── ui/FormFields.tsx              # FieldShell / TextField / PasswordField / SelectField reutilizables
├── features/dashboard/                # Portada: clave, suscripción y último respaldo
├── features/subscription/             # Planes, pagos e historial
├── features/backups/                  # Única copia vigente
├── features/support/                  # Reportes de soporte técnico
├── features/auth/
│   ├── components/
│   │   ├── AuthBrandPanel.tsx         # columna izquierda: logo blanco, métricas, beneficios
│   │   ├── AuthFormPanel.tsx          # columna derecha: tabs + formularios + accesos
│   │   ├── AuthFields.tsx             # re-export de shared/ui/FormFields (compatibilidad)
│   │   ├── RegisterForm.tsx           # alta con licencia de prueba
│   │   └── LoginForm.tsx              # acceso con perfil
│   └── data/auth-data.ts              # beneficios, sectores, perfiles y barra de confianza
├── features/landing/
│   ├── components/
│   │   ├── SiteHeader.tsx             # header fixed h-20 (logo local)
│   │   ├── HeroHeader.tsx             # helper MS + HighlightPill + cabecera hero
│   │   ├── HeroMockup.tsx             # wrapper del carrusel (antes: mockup HTML del POS)
│   │   ├── ScreenshotCarousel.tsx     # carrusel 3D apilado, relevo suave estilo NexusPOS
│   │   ├── product/ProductCard.tsx    # ProductCard + CartRow (sin uso tras el carrusel)
│   │   ├── Kbd.tsx                    # atajo inline <strong class="font-mono">
│   │   ├── Hero.tsx                   # glow + HeroHeader + HeroMockup
│   │   ├── KeyFeatures.tsx            # 6 tarjetas (#caracteristicas)
│   │   ├── ProductCatalog.tsx         # 4 grupos + 6 datos de ficha (#productos)
│   │   ├── KeyboardCheatSheet.tsx     # F1,F2,F3,F4,F5,F12,ALT+Q
│   │   ├── ComparisonTable.tsx        # Desktop vs POS Nube
│   │   ├── Pricing.tsx                # planes mensual $4.99 y anual $59.99 (#precios)
│   │   ├── HardwareFaq.tsx            # 3 FAQs
│   │   ├── FinalCta.tsx               # CTA gradiente (#descargar)
│   │   └── Footer.tsx                 # 3 columnas + legal (logo local)
│   └── data/landing-data.tsx          # contenido tipado (ReactNode para negritas/mono inline,
│                                      # mockProducts, mockCartRows, screenshots, tonos de celda)
└── index.css                          # @font-face Material Symbols + @theme MD3 + shimmer
```

### Assets autoalojados (cero dependencias de red)

| Archivo | Uso |
| :--- | :--- |
| `public/fonts/plus-jakarta-sans-{latin,latin-ext}.woff2` | Tipografía principal (variable 200-800) |
| `public/fonts/jetbrains-mono-{latin,latin-ext}.woff2` | Etiquetas, números y atajos (variable 100-800) |
| `public/fonts/fonts.css` | 4 `@font-face` con `unicode-range` por subset |
| `public/MaterialSymbolsOutlined.ttf` | Iconos (`.material-symbols-outlined`) |
| `public/novuspos-logo.png` | Logo del header y footer (512×141) |
| `public/imagen/novusposventa.png` | Captura del sistema mostrada en el carrusel del hero (1600×1280) |

> ❌ No enlaces a `fonts.googleapis.com` ni a `lh3.googleusercontent.com`: si falla la red el diseño se degrada y los assets de Stitch caducan (en el screenshot oficial los logos salen rotos). `index.html` precarga solo los dos woff2 latin.

---

## 3. Orden de secciones (idéntico a Stitch, más `ProductCatalog`)

1. `SiteHeader` — fijo, logo + Características/**Productos**/Precios/Documentación + Iniciar Sesión.
2. `Hero` — glow; grid de 2 columnas en desktop: texto a la izquierda (píldora, headline, slogan, CTAs, trust badges) y carrusel de capturas (`#interfaz-en-vivo`) arriba a la derecha. En móvil se apila.
3. `KeyFeatures` (`#caracteristicas`) — 6 tarjetas con copy verificado contra los contextos 02–06 y 08 (ver §5.3).
4. `ProductCatalog` (`#productos`) — 4 grupos de productos + 6 datos de ficha; añadida a pedido explícito, no está en Stitch (ver §5.10).
5. `KeyboardCheatSheet` — 7 atajos reales: `ALT+1`…`ALT+7`, `F12` y `ALT+Q`. Actualmente comentado en `LandingPage.tsx`.
6. `ComparisonTable` — 5 filas comparativas con copy verificado contra contextos 01, 02, 05 y 08 (ver §5.4).
7. `Pricing` (`#precios`) — licencia profesional $4.99, badge "PRIMER MES $0"; checklist verificado (ver §5.5).
8. `HardwareFaq` — 3 preguntas; periféricos y requisitos verificados contra docs (ver §5.4).
9. `FinalCta` (`#descargar`) — gradiente primary→on-primary-fixed-variant.
10. `Footer` — producto, ayuda, legal, línea legal.

---

## 4. 🚨 Tailwind v4: regla crítica de tokens

**NUNCA escribir utilidades a mano en `@layer utilities`.** Tailwind v4 las genera desde `@theme` usando *namespaces*. Si se usa el namespace equivocado, la clase **no existe y falla en silencio**.

| Namespace | Genera | Ejemplo |
| :--- | :--- | :--- |
| `--color-*` | `bg-*`, `text-*`, `ring-*`, `divide-*`, `from-*` **+ modificadores `/40`** | `--color-surface: #f7f9fb` → `bg-surface`, `bg-surface/50` |
| `--text-*` | `text-*` (tamaño + `--line-height` + `--font-weight`) | `--text-body-md: 14px` → `text-body-md` |
| `--font-*` | `font-*` (familia) | `--font-display: "Plus Jakarta Sans"` → `font-display` |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, `space-y-*` | `--spacing-space-xl: 2.5rem` → `p-space-xl`, `gap-space-xl` |
| `--radius-*` | `rounded-*` | `--radius-xl: 0.75rem` |

```css
/* ✅ Correcto */
@theme {
  --spacing-space-lg: 1.5rem;   /* → p-space-lg, px-space-lg, gap-space-lg, md:p-space-lg */
  --text-headline-lg: 36px;
  --text-headline-lg--line-height: 44px;
  --text-headline-lg--font-weight: 700;
}

/* ❌ Incorrecto: `--space-lg` no genera ninguna utilidad */
@theme { --space-lg: 1.5rem; }
```

**Síntoma real de este bug:** tarjetas sin padding y página ~25 % más corta que Stitch (4172px vs 5350px). Al corregir los namespaces quedó en 5292px. Además, las utilidades escritas a mano bloquean modificadores de opacidad (`bg-primary-fixed/40`).

**Segundo bug (escaneo de HTML de referencia):** Tailwind v4 escanea por defecto `public/imagen/module_*.html` y generaba ~30 kB de CSS huérfano (65 kB vs 34.5 kB). `src/index.css` los excluye con `@source not "../public/imagen/*.html";`; no eliminar esa línea.

- Material Design 3 completo en `@theme` (`primary #003ec7`, `primary-container #0052ff`, `surface #f7f9fb`, `on-surface #191c1e`, `secondary #006c49`, etc.).
- Tipografía: display 48/56, headline-lg 36/44, headline-md 24/32, headline-sm 20/28, body-lg 16/24, body-md 14/20, body-sm 12/16, label-md 13/18, label-sm 11/14 (JetBrains Mono), numeric-total 32/38, numeric-keypad 20/26.
- Espaciado: `space-xl` 2.5rem · `space-lg` 1.5rem · `space-md` 1rem · `space-sm` .5rem · `space-xs` .25rem · `margin` 1.5rem.
- Iconos: helper `MS` → `<span className="material-symbols-outlined">`, con `.material-symbols-outlined` definido en `index.css` (`font-feature-settings: 'liga'`).
- Atajos inline: componente `Kbd` (fuera de `data/` para no romper fast-refresh).
- Componentes ≤ 300 líneas; hooks ≤ 200; contenido en `data/`; `aria-hidden` en iconos decorativos.

---

## 5. Desviaciones deliberadas conocidas

1. **CTA del hero:** usa `px-space-lg` en lugar del `px-space-xl` del HTML de Stitch. La geometría del botón es idéntica, pero evita que la etiqueta se parta en 3 líneas con Plus Jakarta Sans (fuente real del diseño, más ancha que el fallback Times del screenshot); con este ajuste se parte en 2 líneas, igual que en Stitch.

2. **Carrusel de capturas en el hero (pedido explícito):** `HeroMockup.tsx` ya no contiene el mockup HTML del terminal; delega en `ScreenshotCarousel.tsx`, que apila las capturas reales de `public/imagen/` y reproduce el efecto de **nexusposgobal.com**:
   - `setInterval` de **4s** alternating `setActive((i) => (i + 1) % screenshots.length)`.
   - Activa: `z-20 opacity-100` + `rotateX(15deg) rotateY(-15deg) rotateZ(5deg) translateZ(0)`.
   - Inactiva: `z-10 opacity-30` + `translateZ(-180px) translateY(-90px) translateX(110px)`.
   - Transición `duration-1000 ease-in-out`: la imagen de arriba se oculta suavemente mientras la de abajo pasa al frente.
   - Contenedor `[transform-style:preserve-3d] [perspective:1200px]`, `max-w-5xl aspect-[5/4]`.
   - Respeta `prefers-reduced-motion`.
   - El ancla `#interfaz-en-vivo` se conserva, ahora en la **columna derecha del hero**: `HeroHeader` usa `lg:grid-cols-2 items-center gap-space-xl`, con el copy alineado a la izquierda en desktop y el carrusel subido desde el fondo. En móvil se apila con `mt-space-lg`.

   Para agregar capturas: copiar el PNG a `public/imagen/` y añadir un objeto `{ src, alt }` al array `screenshots` en `landing-data.tsx`. Capturas actuales (5, en orden de módulo): `novusposventa.png` (1600×1280, ventas), `novuspos_producto.png` (1280×1053, productos), `novuspos_kardex.png` (1600×1280, Kardex), `novus_caja.png` (1280×1384, caja) y `novus_cliente.png` (1600×1280, clientes). El relevo de 4s rota sobre todas; las dos primeras se cargan con `loading="eager"` y el resto con `lazy`. `ScreenshotSlide` admite `fit?: 'contain' | 'cover'`: `novus_caja.png` (1280×1384) usa `fit: 'cover'` con `object-cover object-top` para llenar el contenedor 5:4 sin bandas laterales (recorta la parte baja y conserva la cabecera); el resto usa `object-contain`. `ProductCard.tsx` y los mocks del carrito quedaron sin uso (no eliminados por si se requieren después).

3. **Copy verificado contra el sistema real (pedido explícito):** el HTML de Stitch contenía afirmaciones falsas o no verificables. Prevalece `novus-post/docs/context/`:
   - Atajos `F1-F7` → navegación real `ALT+1`…`ALT+7`; `F12` es Cobro Estándar (no "Cobro Mixto", que es `F8`).
   - Eliminado el claim "latencia por escaneo < 0.8ms" (sin respaldo documental).
   - "Papelera de reciclaje" → baja lógica (soft delete) que preserva Kardex.
   - Etiquetas: 7 simbologías y medidas en **mm** (no DPI); exportación `.xlsx` + CSV con BOM UTF-8.
   - Kardex: libro append-only con fecha/hora, usuario, motivo, lote y ticket; exportación XLSX/PDF.
   - Caja: `efectivo esperado = fondo inicial + ventas + abonos + ingresos manuales - gastos - devoluciones en efectivo`; se eliminó "cierre ciego" y se añadió el cálculo de sobrante/faltante en vivo.
   - Básculas: Torrey/Rhino/Dibal con puerto COM y baudios; se eliminaron CAS, "probada y comprobada" y "COM1-COM8" (la validación con hardware sigue pendiente).
   - Créditos: corregido "fadas" → "fiadas"; eliminada la impresión de recibos de abono (ESC/POS no conectado), reemplazada por el impacto inmediato en la gaveta.
   - Titular de `KeyFeatures`: "hasta 500,000 transacciones mensuales" → "alto volumen transaccional" (claim sin respaldo).
   - `KeyCap` de `KeyboardCheatSheet` usa tamaño compacto para teclas con modificador (`ALT+1`…`ALT+5`).

4. **Tabla comparativa y FAQ verificadas (pedido explícito):** `comparisonRows` y `faqs` (en `landing-data.tsx`) se auditaron contra los contextos 00, 01, 02, 05 y 08. Se eliminó "100% Ininterrumpido", la latencia inventada (0.5–1.2 ms / 300–2500 ms) y el claim "ESC/POS directo al puerto RAW" (08 §1/§6: impresión física no integrada; 02 §4: la previsualización no imprime). La fila de básculas ahora habla de puerto COM y baudios con Torrey/Rhino/Dibal, y la de documentos de venta de PDF vectorial 80/58mm/Carta. El FAQ de periféricos se alineó con lo anterior (sin "cualquier impresora ESC/POS", sin CAS/BAR-9) y el de requisitos se limitó a lo documentado (Electron 64 bits, ventana mínima 960×600, sin cifras oficiales de CPU/RAM). El precio de $4.99 se conserva por ser decisión comercial (ver §3, ítem 6). Ajuste posterior: la FAQ de SQLite perdió "instantánea" y la promesa "si se corta la energía ningún registro queda a medias" (00 §1, 02 §113 documentan transacciones atómicas, no durabilidad ante corte de luz), y la FAQ de requisitos perdió "Electron de 64 bits" y el absoluto "sin dependencia de un servidor" (01 §1/§4, 00 §3.7, 02 §4): ahora distingue el núcleo local de las funciones que sí requieren red (primer ingreso, OTP, reportes y tasas BCV).

5. **Pricing verificado (pedido explícito):** el checklist de `Pricing.tsx` y su línea "Para Windows 11 / 10 x64" se auditaron contra los contextos 00, 01, 02, 04, 05 y 08. Se eliminó "ultra-alto rendimiento", "sin ralentización", "impresoras térmicas ESC/POS de 58/80mm y cajón de dinero" (08 §1/§6: no integrados; 02 §4: previsualizar no imprime), "actualizaciones continuas v2.x y soporte por WhatsApp y Ticket" (00 §3.7: ticket requiere internet; WhatsApp no es canal de soporte documentado) y "copias de seguridad automáticas a memorias USB o carpetas compartidas" (08 §1: respaldo manual en `userData/backups` con SHA-256 y copia preventiva). Windows 10 se retiró en su momento por no aparecer en los contextos, pero se **reincorporó** en §5.8 al verificar el proyecto de escritorio (Electron 39 admite Windows 10+). Los precios ($4.99/mes con primer mes $0 y $59.99/año), los 30 días gratis y "sin tarjeta" se conservan por ser decisiones comerciales, no claims técnicos (ver §3, ítem 6). El plan anual se agregó a pedido explícito con dos tarjetas que comparten checklist y CTA; no se afirma ahorro porque doce mensualidades cuestan menos. El número de versión y el tamaño del instalador se retiraron del copy en §5.9.

6. **Hero y footer verificados (pedido explícito):** `HeroHeader.tsx` —además del carrusel de §5.2— y `Footer.tsx` se auditaron contra los contextos 00, 01, 02, 08 y 09. Se eliminaron el badge "Sin caídas por internet" y el "Opera 100% sin conexión" (bootstrap/OTP, reportes y BCV requieren red: 01 §1/§4, 00 §3.7, 02 §4), "Procesa transacciones en milisegundos" (métrica sin respaldo en los contextos modulares), "imprime tickets térmicos ESC/POS de 80mm" (08 §1/§6: no integrado; solo PDF 80/58mm), "x64" (no documentado), el superlativo "más rápido" y "sin ataduras a la nube". El CTA secundario pasó de "Ver Demostración" a "Ver capturas del sistema" porque el ancla es un carrusel de capturas. El precio se conserva por ser decisión comercial; la versión y el tamaño del instalador se retiraron en §5.9. Nota: el matiz de "validación pendiente" y la mención de SQLite de este ítem fueron **sustituidos** por el ítem 7.

7. **Copy positivo para el usuario final (pedido explícito):** se reescribió el texto de **todas** las secciones (`HeroHeader`, `KeyFeatures`, `landing-data.tsx`, `ComparisonTable`, `HardwareFaq`, `Pricing`, `FinalCta`, `SiteHeader`, `Footer` e `index.html`) para que explique beneficios comprensibles para quien va a usar el sistema, sin detalles de implementación ni frases restrictivas. Se eliminaron del bundle: "pendiente de validación física", "aún no están integrados", "no hay cifras oficiales", SQLite/WAL, "transacción atómica", `append-only`, `soft delete`, `SHA-256`, RS-232/COM/baudios, ESC/POS, "modo WAL", "arquitectura offline-first", "Servidores Cloud Sincronizados", "Certificación Fiscal", "Drivers OPOS", "Mesa de Ayuda 24/7" y "Documentación API". Textos vigentes: datos → "queda registrado al momento y sigue disponible… incluso sin conexión"; básculas → "toma el peso directamente en la venta, sin digitar los gramos"; tickets → "listos para descargar"; requisitos → "NovusPOS funciona en Windows 10 y Windows 11 (en computadoras de 64 bits), así que no necesitas la versión más reciente para empezar" (ver §5.8); respaldos → "respaldos de tu información y restauración". Titulares: hero "rápido, confiable y siempre disponible"; características "PENSADO PARA TU DÍA A DÍA" / "Todo para vender, controlar tu inventario y cerrar el día con confianza"; comparativa "¿Por qué elegir NovusPOS para tu negocio?". Los `subtitle` de atajos dejaron de usar "Modal de pago" y "1-Click ticket directo". `Kbd` se retiró de `landing-data.tsx` (ya no hay atajos inline en las tarjetas). La veracidad funcional se conserva: no se afirma impresión térmica conectada ni rendimiento inventado. Ver skill §14.

8. **Compatibilidad con Windows (pedido explícito):** el FAQ `¿Qué necesito para empezar?` y la línea de `Pricing` pasaron de "Windows 11" a **"Windows 10 o Windows 11"**. Evidencia en `novus-post/`: `package.json` usa `electron: ^39.2.6` (`39.8.10` en lock) y el README oficial de Electron 39 indica *"Windows (Windows 10 and up)"*; `electron-builder.yml` genera `NovusPOS-Setup-${version}-x64.exe`, por lo que se menciona "computadoras de 64 bits". No existe ningún chequeo de versión de Windows en el código: "Windows 11 Fluent Design / WinUI 3" en 00 y AGENTS.md es **estilo visual**, no requisito de SO. No se menciona Windows 7/8/8.1 (Electron los dejó de soportar en v23). La red solo se necesita para descargar, iniciar sesión la primera vez y tasas; el trabajo posterior funciona sin conexión.

9. **Sin número de versión en la landing (pedido explícito):** se retiró `2.4.0` de todo el texto visible porque se veía mal. `ReleasePill` → `HighlightPill` (`⚡ TRABAJA SIN DEPENDER DE INTERNET`); subtítulos de descarga en `HeroHeader` y `Pricing` → `30 días gratis • sin tarjeta`; línea del `FinalCta` → `30 días gratis • sin tarjeta`; cabecera de la comparativa → `NovusPOS Desktop`; enlace del footer → `Novedades`. No reintroducir `v2.4.0`, `Versión 2.4.0`, `~85 MB` ni `(.exe)`: la versión real está en `novus-post/package.json` y en el artefacto de `electron-builder.yml`, no en el sitio web.

10. **Sección de productos (pedido explícito):** se añadió `ProductCatalog.tsx` con el ancla `#productos` entre `#caracteristicas` y la comparativa, más el enlace "Productos" en `SiteHeader`. No existe en Stitch: sale del módulo real `inventory` (contexto 03 y `006_seed_products.ts`). `productGroups` (4 tarjetas): lo de todos los días (8 categorías sembradas), por pieza/caja/peso (unidades y decimales), tallas/colores/presentaciones (variantes), combos/servicios/insumos (tipos de producto y `combo_items`). Bloque "Así se ve el catálogo de un abasto" (`productVarieties`, 8 categorías / 33 ejemplos con medida, tomados de `006_seed_products.ts` y acortados para etiquetas). `productCapabilities` (6 fichas): códigos de barras, costo y ganancia, precios por mayoreo, impuestos por producto, lotes y caducidad, existencias y avisos. Copy con ejemplos concretos y frases naturales ("1,450 kg se cobra por 1,450 kg, no por dos"), sin `SKU`, `FEFO`, SQLite, `append-only` ni detalles de implementación. "Los productos que vencen primero son los que se descuentan primero" es la versión comercial del descarte FEFO. Ver skill §15.

11. **Vistas de Iniciar Sesión / Registro (pedido explícito):** se replicó la pantalla de Stitch `projects/14269822984035378146/screens/b7520097c4d14ab9913cf7ab915c00cd` ("Iniciar Sesión / Registro - NovusPOS", DESKTOP 2560×2048, HTML `fileEntries/html`). Se conservan clases, orden, gradientes, iconos, sparkline y el split `lg:grid-cols-12` 5/7. Se monta como ruta limpia: `/auth` (registro, estado por defecto de Stitch) y `/auth/login` (login, enlace del header). `App.tsx` decide por `window.location.pathname`; el `#` solo se usa para anclas de la landing. `MS` se movió a `shared/ui/MS.tsx` con soporte `filled` para los iconos `speed`/`workspace_premium`; el logo de la columna izquierda usa `novuspos-logo-white.png` (generado desde el logo, fondo transparente y trazo blanco) porque el original tiene fondo blanco opaco y con `brightness-0 invert` salía como un rectángulo. Copy auditado según §5.7 y §5.9: se retiraron `VERSIÓN 2025.2 READY · DESKTOP + NUBE`, `+40% Velocidad`, `1.8 seg`, `100% Uptime`, el testimonial inventado (40% menos filas, nunca se traba), `Seguridad Bancaria TLS 1.3`, `Cifrado SSL 256-bit`, `Compatible con Tickets ESC/POS`, `Sincronización en la Nube`, los botones de Google Workspace / Microsoft 365 y la selección de múltiples cajas. En su lugar: píldora "LISTO PARA WINDOWS · TRABAJA SIN INTERNET", métricas "Al instante / Siempre listo", tarjeta de garantía de prueba, "Respaldos de tu información", "Tus datos protegidos"y accesos "Descargar para Windows" y "Ver capturas del sistema". El selector "Caja / Terminal Asociada" de Stitch se eliminó sin reemplazo (a pedido explícito): el login solo pide correo y contraseña. Actualización posterior: conectado a `POST /auth/login` con `{ email, password }` (ver §5.13). Ver skill §16.

12. **Panel de Control de Clientes (pedido explícito):** se replicó la pantalla de Stitch `screens/98a61d2fa58e4476ab0d250be8a57755` ("Panel de Control de Clientes - NovusPOS", DESKTOP 2560×3558, HTML `fileEntries/html`, 37.8 kB) en la ruta `/panel`, enlazada desde el alert de login. Layout idéntico al HTML: `aside fixed ... w-64`, header `fixed left-64 right-0 h-16`, `<div class="pl-64">`, `main pt-16`, bento grid `lg:grid-cols-12` 7/5, tabla de facturas y lista de respaldos. Componentes en `features/panel/` (`PanelSidebar`, `data/panel-data.ts`); `novuspos-icon.png` es un recorte del logo para el sidebar. Copy auditado (skill §17): sin versión, `.EXE`, MD5, ESC/POS, RS-232, SQLite, AES-256, nube, `Offline-Ready`, `24/7`, `Soporte VIP`, `REG-WIN11-04`, `ID #8829`, KPIs ni bloques de equipo asignado. Los componentes estáticos `PanelOverview`, `PanelLicense`, `PanelBilling` y `PanelBackups` y sus datos falsos desaparecieron; la portada usa `features/dashboard/` y los módulos viven en `features/subscription/`, `features/backups/` y `features/support/` (ver §5.15–§5.18).

13. **Capa HTTP y sesión global:** se añadió `src/shared/services/apiClient.ts` (fetch nativo, `VITE_API_URL` con fallback `http://localhost:8000/api/v1`, Bearer desde `localStorage`/cookie, errores 401 → limpia sesión y redirige a `/auth/login`, 422 → `ValidationError` con `issues` de FastAPI/Laravel, 500 → mensaje genérico), `src/shared/lib/auth-storage.ts` y `auth-types.ts`, `src/shared/context/AuthContext.tsx` + `auth-context.ts`, `useAuth` y `ProtectedRoute` (skeleton MD3). La sesión se hidrata de forma síncrona al recargar. El `isLoading` del `AuthContext` quedó reservado para resolución de sesión y **ya no** usa el contador global `subscribeLoading`: usarlo desmontaba `ProtectedRoute` en cada petición HTTP y provocaba un loop infinito de peticiones en modo `api`. El indicador global sigue disponible para spinners de formularios, no para el guardián de rutas. `AuthProvider` se monta en `main.tsx`, `/panel` está envuelto en `ProtectedRoute`, el login usa `POST /auth/login` y guarda `{token,user}`, y el sidebar tiene logout. `.env.example` y `vite-env.d.ts` documentan la variable. Responsabilidad del API real: exponer `POST /auth/login` con ese contrato; el registro sigue demostrativo. Refactorizado con patrones (skill §19): `Facade` en `apiClient.ts`, `Transport` + errores + bus de eventos en `services/http/`, `Repository` inyectable (`SessionStore`), `Use case + Gateway` (`features/auth/services/authService.ts`), hook `useLogin` como container y `AuthFormPanel` presentacional, `routeResolver.ts` puro y `ProtectedRoute` como Guard. Verificado con API mock 422 (mensaje general y error por campo) y con/sin sesión en `/panel`. El backend aún no existe: `VITE_AUTH_MODE` (`.env.example`) selecciona `demo` (por defecto, `demoAuthGateway` sin red) o `api` (`httpAuthGateway` → `AUTH_ENDPOINTS.login`). Rutas en `shared/services/endpoints.ts`; el login demo acepta correo con `@` y contraseña de 4+ caracteres y muestra un aviso solo en modo demo. Ver skill §20.

14. **Recuperación de contraseña (pedido explícito):** se replicaron las 2 pantallas de Stitch `54dd58adf2904fa2b26ba64f3876d27d` (Solicitar Enlace) y `57592e1e7d8241ec9751a890983bd430` (Nueva Contraseña) con sus clases exactas, sin el copy técnico de Stitch (`CLOUD GATEWAY`, `TLS 1.3`, `PCI-DSS`, `AES-256`). Rutas limpias `/auth/recuperar` y `/auth/restablecer?token=…&email=…` (resueltas antes del prefijo `/auth`), enlace desde *"¿Olvidaste tu contraseña?"* del login. Misma arquitectura que §5.13: `PasswordRecoveryGateway` + adaptadores demo/API + factory + casos de uso + hooks container + componentes presentacionales + funciones puras (`recoveryLink.ts`, `passwordStrength.ts`, `formErrors.ts`). Endpoints nuevos `POST /auth/forgot-password` (`{ email }`) y `POST /auth/reset-password` (`{ token, email, password }` → `{ token, user }` con auto-login). En demo el banner de éxito ofrece *"Abrir enlace de demostración →"* para probar el flujo completo sin backend; sin `token`, la pantalla pide uno nuevo. Ver skill §21.

15. **Módulo de Suscripción (pedido explícito):** primer módulo funcional del panel. Se eliminó `PanelBilling` (Visa •••• 4821, cobro automático, `INV-*`, fechas fijas) y sus datos falsos de `features/panel/data/panel-data.ts`. Nueva feature `features/subscription/` con la misma arquitectura que auth/recuperación (gateway + adaptadores demo/API + factory + servicio fachada + hooks contenedores + componentes presentacionales). Ruta limpia `/panel/suscripcion` (el historial de pagos ya no se muestra en la portada); actualizado con catálogo de planes, resumen, filtros, búsqueda y columna de suscripción (ver §5.18 del skill); `resolveAppRoute` pasa `section` a `PanelPage` y el sidebar marca la opción activa con `aria-current`. La tarjeta muestra el plan contratado (`plans` en `data/`, hoy dos: **NovusPOS Mensual** $4.99 y **NovusPOS Anual** $59.99), estado, mensualidad/anualidad y vigencia; el catálogo permite *Elegir este plan* para cambiar de plan. La tabla asocia cada pago a su suscripción (`planId` del pago) y muestra mes pagado, resumen, filtros y búsqueda, además de referencia, fecha, método, banco, monto, estado y comprobante. El modal de pago tiene 3 pasos: datos bancarios de Novus con botón copiar y selección pago móvil/transferencia; campos de referencia/fecha/banco con ayuda inspirada en el reporte de pagos de **Cashea** (operación para Banco de Venezuela, serial para depósitos) y captura del comprobante; resumen y envío. `lib/proofImage.ts` valida JPG/PNG/WEBP ≤8 MB y comprime antes de guardar; `lib/paymentDraftStore.ts` cachea el borrador por suscripción. Los campos del paso 2 usan los componentes reutilizables de `shared/ui/FormFields.tsx` (idénticos a los del login: icono, foco, anillo de error, ayuda), el selector de método y la subida comparten `FieldShell`, y el resumen se aisló en `PaymentSummary.tsx` para mantener el modal bajo 300 líneas. Endpoints conectados en `BILLING_ENDPOINTS`: `GET /billing/subscription` (idealmente `{ plans, subscription, payments }`; si faltan planes o pagos el adaptador HTTP completa con `GET /billing/plans` y `GET /billing/payments`), `POST /billing/payments` con `{ subscriptionId, planId, method, reference, paidAt, bank, proofName, proofDataUrl }` y `PATCH /billing/payments/{id}/review`. `planId` viaja en el cuerpo para que Laravel sepa qué plan activar; el modal usa el precio del plan elegido y la periodicidad del plan (`al mes` / `al año`). El alta deja la suscripción en `pending_review` y la evaluación cambia el plan, el monto y `renewsAt` según el intervalo, pasando a `active`; la tabla expone *"Simular aprobación"* / *"Rechazar"* en demo y *"Aprobar pago"* / *"Rechazar"* en `api` (RBAC lo enforza el backend). La recarga posterior al envío es en segundo plano para no desmontar el modal de confirmación. Los datos de cuenta son placeholders de demostración centralizados en `data/subscription-data.ts` y se advierte en la UI. Ver skill §22.

16. **Copias de Seguridad: una sola copia vigente (pedido explícito):** el portal ya no lleva historial, verificación, descarga ni alta manual: muestra únicamente la copia más reciente que envía NovusPOS Desktop, para ahorrar almacenamiento en el servidor. Se eliminaron `BackupStats`, `BackupTable`, `BackupStatusChip`, `BackupFileField`, `RegisterBackupModal`, `useBackups` y `backupValidation`. `features/backups/` queda con `BackupSnapshot`, `useLatestBackup`, `BackupCard` y `BackupOverview`; la tarjeta tipo disco duro dice cuándo fue la última copia y explica que, al reinstalar el sistema y entrar con la cuenta, los datos quedan como si no hubiera pasado nada. `BACKUP_ENDPOINTS`: `GET /backups/latest` y `POST /backups` (upsert multipart con `database`, `created_at`, `sha256` y `source`, compatible con el adaptador Laravel del escritorio, contextos 08). Los campos técnicos no se muestran. Demo persiste un único objeto en `novuspos:demo-latest-backup` y migra el registro anterior. Ver skill §23.

17. **Panel general: clave, suscripción y último respaldo (pedido explícito):** `PanelPage` compone solo `<DashboardSection />` en `/panel`; el historial de pagos y el módulo de copias viven en sus rutas. Se eliminaron los cuatro KPIs (`DashboardStats`), el bloque de equipo (`LicenseCard`) y los endpoints `license`/`release-device`: la clave de suscripción válida activa todo el sistema de escritorio, así que no hay asignación ni cambio de equipo. La clave se muestra **completa y copiable** (la envía la API y cambia con cada pago), el estado lo decide la API (*Activa*, *Pago en revisión*, *Inactiva · pendiente de pago*, *Cancelada*) y solo se muestra la fecha del último respaldo. Componentes: `DashboardBanner`, `AccessCard`, `LastBackupCard` e `InstallerCard`. `PANEL_ENDPOINTS`: `GET /panel/overview` con `{ organizationName, planName, subscriptionStatus, dueAt, activationKey, activationKeyRenewsAt, lastBackupAt }`. En demo el estado inactivo se deriva de `dueAt` vencido, la clave se deriva del pago aprobado en `novuspos:demo-billing` y `novus-anual` se muestra como *NovusPOS Anual*. Ver skill §24.

18. **Soporte Técnico (pedido explícito):** cuarta ruta `/panel/soporte`, nueva feature `features/support/` con el patrón puerto + adaptadores demo/API + factory + fachada + hook contenedor + componentes presentacionales. Formulario con correo precargado de la sesión, tema, asunto y detalle, validados con reglas puras (correo, tema, asunto 5–80 y detalle 20–1000). Los campos usan `shared/ui/FormFields.tsx`; se agregó `TextAreaField` con el mismo estilo del login. Al enviar se muestra una alerta de éxito con número de reporte y opción de enviar otro; no hay listado de tickets. Contrato `POST /support/tickets` con `{ email, topic, subject, description, source: 'web' }` → `{ id, reference, message }`. Ver skill §25.

---

## 6. Estado y verificación

- ✅ Réplica exacta de Stitch validada sección por sección con capturas headless de Chrome a 1280px contra el HTML renderizado y el screenshot oficial, **excepto** el copy verificado del hero, `KeyFeatures`/`KeyboardCheatSheet`, tabla/FAQ, `Pricing` y `Footer` (ver §5).
- ✅ Copy de `KeyFeatures` y `KeyboardCheatSheet` auditado contra los contextos 00, 02, 03, 04, 05, 06 y 08; eliminados los claims falsos de Stitch (ver §5.3).
- ✅ Copy de todas las secciones reescrito en tono positivo y sin detalles internos; verificado en el bundle (ver §5.7).
- ✅ Sección `#productos` renderizada y verificada en DOM con Chrome headless; sin términos internos en el bundle (ver §5.10).
- ✅ Vistas `/auth` y `/auth/login` renderizadas y verificadas con Chrome headless a 1280px; bundle sin versión, ESC/POS, nube, TLS, SSO ni métricas inventadas (ver §5.11).
- ✅ Vista `/panel` renderizada y verificada con Chrome headless a 1280px (sidebar, clave, suscripción, último respaldo e instalador); bundle sin versión, ESC/POS, RS-232, SQLite, AES-256 ni token real (ver §5.12).
- ✅ `/panel` sin sesión redirige a `/auth/login`; con token y usuario en `localStorage` renderiza el panel con el email del usuario. Errores 422 verificados con API mock: mensaje general y error de campo (ver §5.13).
- ✅ Recuperación: ambas pantallas sin copy sensible; flujo demo (solicitar → enlace demo → nueva clave) entra a `/panel`; sin `token` aparece el aviso; modo `api` con mock 422 muestra error general y por campo en `forgot-password` y `reset-password` (ver §5.14).
- ✅ Suscripción: `/panel/suscripcion` muestra los planes mensual y anual, el plan actual, el historial con columna de suscripción, mes pagado, resumen, filtros y búsqueda; sin Visa ni cobro automático. Flujo completo del plan anual en demo **y modo `api` con mock**: elegir plan → monto $59.99 al año → pago → `pending_review` → aprobación → plan anual activo y *ANUALIDAD*; el log del mock confirma `"planId":"novus-anual"` en `POST /billing/payments` (ver §5.15).
- ✅ Copias de Seguridad: `/panel/respaldos` muestra solo la tarjeta de la última copia en demo y `api` (mock), sin contadores, espacio, alta ni descarga; verificado por CDP sin errores de consola; el log del mock confirma `GET /backups/latest` (ver §5.16).
- ✅ Panel general: `/panel` muestra la clave completa, el estado de la suscripción, el plan vigente (también *NovusPOS Anual*) y la fecha del respaldo en demo y `api` (mock), sin pagos ni equipo asignado; verificado por CDP sin errores de consola; el log del mock confirma `GET /panel/overview` (ver §5.17).
- ✅ Landing `#precios` muestra las dos opciones de pago ($4.99/mes y $59.99/año) con el mismo checklist y CTA, verificado por CDP en demo y `api` (ver §5.5).
- ✅ Soporte Técnico: `/panel/soporte` valida los campos vacíos, envía el reporte y muestra «¡Reporte enviado!» con número de reporte en demo y `api` (mock), sin errores de consola; el log del mock confirma `POST /support/tickets` (ver §5.18).
- ✅ Altura ≈4780px con el hero de dos columnas (antes, 5523px con el carrusel apilado abajo; oficial 5350px). La sección de productos aumentó la altura respecto a la medición original. Posición del carrusel a 1280px: `x≈660, y≈230, w≈596, h≈477`.
- ✅ Tipografías, iconos y logo autoalojados (funciona offline, sin CDN).
- ✅ `npm run build` y `npm run lint` limpios.
- ✅ Autenticación del MCP Stitch configurada vía API key en `~/.config/opencode/secrets/stitch-api-key`.

---

## 7. Verificación obligatoria

```bash
cd novuspos-front
npx tsc --noEmit
npm run build
npm run lint
```

Para comparar visualmente, servir con `npm run dev -- --host 127.0.0.1 --port 5173` y capturar con Chrome headless a `--window-size=1280,7000`; el viewport de referencia es 1280px.
