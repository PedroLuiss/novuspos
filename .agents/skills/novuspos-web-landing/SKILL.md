---
name: novuspos-web-landing
description: Guía de arquitectura y diseño para la landing page oficial de NovusPOS (novuspos-front: React 19 + Vite + Tailwind v4). Úsala SIEMPRE que se modifique el sitio web, se componenticen vistas desde Stitch o se agreguen secciones al marketing.
---

# Skill: NovusPOS Web — Landing Page Oficial

Complementa a `novuspos-guide`. Aplica al repositorio **`novuspos-front/`** (sitio de marketing), distinto del shell Electron de `novus-post/`.

> 🛑 **Regla de oro:** la landing es una **réplica exacta** del diseño de Stitch **"NovusPOS - Landing Page Oficial"**. Textos, colores, iconos, clases y orden de secciones deben coincidir con el HTML de Stitch. **No improvises ni rediseñes.**
>
> ⚠️ **Excepción actual (pedido explícito):** el hero ya no usa el mockup HTML de Stitch. Muestra capturas reales del sistema en un carrusel apilado con el efecto de `nexusposgobal.com`. Ver §9.
>
> ⚠️ **Excepción 2 (veracidad del copy):** `KeyFeatures` y `KeyboardCheatSheet` fueron auditados contra `novus-post/docs/context/`; donde Stitch afirmaba algo falso sobre el sistema, prevalece la documentación real. Ver §10.
>
> ⚠️ **Excepción 3 (tabla y FAQ):** `ComparisonTable` y `HardwareFaq` también se auditaron; se eliminaron las métricas inventadas y el claim de impresión ESC/POS. Ver §11.
>
> ⚠️ **Excepción 4 (precios):** `Pricing` conserva el precio comercial, pero su checklist técnico y la línea de Windows se auditaron; se eliminaron ESC/POS, backups automáticos y soporte por WhatsApp. Ver §12.
>
> ⚠️ **Excepción 5 (hero y footer):** `HeroHeader` y `Footer` también se auditaron; se eliminaron "100% sin internet", ESC/POS, la latencia en milisegundos y "ultra-alto rendimiento". Ver §13.
>
> ⚠️ **Excepción 6 (tono comercial positivo):** todo el copy se reescribió para que hable de beneficios comprensibles para quien va a usar el sistema. No reintroducir detalles internos (SQLite, WAL, transacciones, `append-only`, `soft delete`, `SHA-256`, RS-232, COM/baudios) ni frases restrictivas ("pendiente de validación", "aún no integrados", "no hay cifras oficiales"). Ver §14.
>
> ⚠️ **Excepción 7 (sección de productos):** se añadió `ProductCatalog` (`#productos`) entre `KeyFeatures` y la comparativa. No está en el HTML de Stitch; sale del módulo real `inventory` de `novus-post`. Ver §15.

---

## 1. Fuente de verdad: Stitch

Proyecto: `projects/14269822984035378146` — **"NovusPOS Landing and Admin Portal"**.
Pantalla: `screens/82fef7e6f4a148cabdc44a42ef4d5ac6` — **"NovusPOS - Landing Page Oficial"** (DESKTOP 2560×10642).
- HTML: `files/10532653372921472128` · Screenshot: `files/14233028886615310537`.

**Flujo:**
1. `tools.stitch.list_projects({ pageSize: 100 })` → localizar el proyecto.
2. `tools.stitch.get_project({ name })` → tema, tipografía, screens.
3. `tools.stitch.list_screens({ projectId })` → `htmlCode.name` y `screenshot.name`.
4. `tools.stitch.download_file({ name })` → HTML (contiene el `tailwind.config` con TODOS los tokens) y screenshot.

> ⚠️ **El screenshot de Stitch NO sirve como referencia tipográfica.** Su renderizador no cargó Google Fonts: **todo el texto sale en Times New Roman** (verificado ampliando el bitmap). Por eso los saltos de línea y algunas alturas del screenshot no coinciden con el diseño real. La verdad son el **HTML + `tailwind.config`**.

---

## 2. Stack

| Capa | Tecnología |
| :--- | :--- |
| Build | Vite 8 + `@vitejs/plugin-react` |
| UI | React 19 + TypeScript |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Iconos | **Material Symbols Outlined** (fuente local) |
| Tipografía | Plus Jakarta Sans + JetBrains Mono (**autoalojadas**) |
| Alias | `@/*` → `src/*` |

### Assets autoalojados (cero dependencias de red)

| Archivo | Uso |
| :--- | :--- |
| `public/fonts/*.woff2` + `public/fonts/fonts.css` | Plus Jakarta Sans (200-800) y JetBrains Mono (100-800), subsets latin/latin-ext |
| `public/MaterialSymbolsOutlined.ttf` | Iconos (`.material-symbols-outlined`) |
| `public/novuspos-logo.png` | Logo del header y footer |
| `public/imagen/*.png` | Capturas del sistema para el carrusel del hero (`novusposventa.png`) |

> ❌ No enlaces a `fonts.googleapis.com` ni a `lh3.googleusercontent.com`: si falla la red el diseño se degrada (y los assets de Stitch caducan).

---

## 3. 🚨 Tailwind v4: regla crítica de tokens

**NUNCA escribas utilidades a mano en `@layer utilities`.** Tailwind v4 las genera desde `@theme` usando *namespaces*. Si usas el namespace equivocado, la clase **no existe y falla en silencio**.

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

**Síntoma típico de este bug:** las tarjetas se ven "pegadas" al borde, sin padding, y la página queda ~25 % más corta que Stitch. Pasó exactamente eso (4172px vs 5350px); al corregir los namespaces quedó en 5292px.

**Segundo bug de Tailwind v4: escaneo de HTML de referencia.** Por defecto Tailwind escanea todos los archivos del proyecto, incluidos `public/imagen/module_*.html`, y genera utilidades huérfanas: el CSS pasó de 34.5 kB a 65 kB al agregar esos archivos. `src/index.css` excluye esa carpeta con `@source not "../public/imagen/*.html";`. No quitar esa línea; las clases de la landing se generan igual desde `src/`.

**Auditoría rápida** de clases usadas vs. generadas:
```bash
node -e "const c=require('fs').readFileSync('dist/assets/'+require('fs').readdirSync('dist/assets').find(f=>f.endsWith('.css')),'utf8');['.p-space-lg{','.px-margin{','.gap-space-md{'].forEach(s=>console.log(s,c.includes(s)?'OK':'MISSING'))"
```

---

## 4. Estructura (FSD adaptada)

```text
src/
├── app/LandingPage.tsx                 # SiteHeader + <main class="pt-20"> + secciones + Footer
├── features/landing/
│   ├── components/
│   │   ├── SiteHeader.tsx              # header fixed h-20
│   │   ├── HeroHeader.tsx              # MS + HighlightPill + cabecera del hero
│   │   ├── HeroMockup.tsx              # wrapper del carrusel (antes: mockup HTML del POS)
│   │   ├── ScreenshotCarousel.tsx      # carrusel 3D apilado, relevo suave estilo NexusPOS
│   │   ├── product/ProductCard.tsx     # ProductCard + CartRow (sin uso tras el carrusel)
│   │   ├── Kbd.tsx                     # atajo inline <strong class="font-mono">
│   │   ├── Hero.tsx                    # glow + HeroHeader + HeroMockup
│   │   ├── KeyFeatures.tsx             # 6 tarjetas (#caracteristicas)
│   │   ├── ProductCatalog.tsx          # 4 grupos + 6 datos de ficha (#productos)
│   │   ├── KeyboardCheatSheet.tsx      # F1-F5, F12, ALT+Q
│   │   ├── ComparisonTable.tsx         # Desktop vs POS nube
│   │   ├── Pricing.tsx                 # plan único $4.99 (#precios)
│   │   ├── HardwareFaq.tsx             # 3 FAQs
│   │   ├── FinalCta.tsx                # CTA gradiente (#descargar)
│   │   └── Footer.tsx                  # 3 columnas + línea legal
│   └── data/landing-data.tsx           # contenido tipado (JSX para negritas/mono inline)
└── index.css                           # @font-face + @theme (tokens) + shimmer
```

Reglas: componentes ≤ 300 líneas, hooks ≤ 200, contenido en `data/`, `aria-hidden` en iconos decorativos, mobile-first.

---

## 5. Tokens visuales (Material Design 3 de Stitch)

| Token | Valor | Token | Valor |
| :--- | :--- | :--- | :--- |
| primary | `#003ec7` | primary-container | `#0052ff` |
| primary-fixed | `#dde1ff` | on-primary | `#ffffff` |
| secondary | `#006c49` | secondary-container | `#6cf8bb` |
| secondary-fixed | `#6ffbbe` | error | `#ba1a1a` |
| surface | `#f7f9fb` | surface-container | `#eceef0` |
| surface-container-low | `#f2f4f6` | surface-container-high | `#e6e8ea` |
| surface-container-lowest | `#ffffff` | on-surface | `#191c1e` |
| on-surface-variant | `#434656` | outline | `#737688` |
| outline-variant | `#c3c5d9` | surface-tint | `#004ced` |

Tipografía: display 48/56 (800), headline-lg 36/44 (700), headline-md 24/32 (700), headline-sm 20/28 (600), body-lg 16/24, body-md 14/20, body-sm 12/16, label-md 13/18 (600), label-sm 11/14 (500, JetBrains Mono), numeric-total 32/38 (700), numeric-keypad 20/26 (600).

Espaciado: `space-xl` 2.5rem · `space-lg` 1.5rem · `space-md` 1rem · `space-sm` .5rem · `space-xs` .25rem · `margin` 1.5rem.

---

## 6. Orden de secciones

1. `SiteHeader` (fixed, h-20) → `<main class="pt-20">`
2. `Hero` — glow; **grid de 2 columnas en desktop**: izquierda = píldora "⚡ TRABAJA SIN DEPENDER DE INTERNET" (sin número de versión), headline, "Lema oficial", subtítulo, CTAs y 4 trust badges (alineados a la izquierda); derecha = carrusel de capturas (#interfaz-en-vivo), movido de abajo hacia arriba. En móvil se apila (texto arriba, capturas abajo).
3. `KeyFeatures` (`#caracteristicas`) — 6 tarjetas con copy verificado contra los contextos 02–06 y 08 (ver §10).
4. `ProductCatalog` (`#productos`) — 4 grupos de productos + 6 datos de ficha (ver §15). Enlace "Productos" en el header.
5. `KeyboardCheatSheet` — 7 atajos reales (`ALT+1`…`ALT+7`, `F12`, `ALT+Q`). Actualmente comentado en `LandingPage.tsx`.
6. `ComparisonTable` — 5 filas con copy verificado contra contextos 01, 02, 05 y 08 (ver §11).
7. `Pricing` (`#precios`) — plan único $4.99; checklist verificado (ver §12).
8. `HardwareFaq` — 3 preguntas; periféricos y requisitos corregidos según docs (ver §11).
9. `FinalCta` (`#descargar`)
10. `Footer`

---

## 7. Checklist al modificar

- [ ] ¿Extraje textos/clases del HTML de Stitch con `download_file`?
- [ ] ¿Los tokens nuevos usan el namespace correcto de Tailwind v4?
- [ ] ¿Los assets nuevos son locales (no CDN)?
- [ ] ¿Usé `MS` para iconos y `Kbd` para atajos inline?
- [ ] ¿Se mantienen ids de ancla y orden de secciones?
- [ ] ¿El copy de características/atajos coincide con `novus-post/docs/context/` (no con Stitch cuando contradiga al sistema)?
- [ ] `npm run build` + `npm run lint` limpios.
- [ ] ¿Actualicé `novus-post/docs/context/09-LANDING-WEB.md`?

---

## 8. Verificación visual (sin Playwright)

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-sandbox `
  --hide-scrollbars --window-size=1280,7000 --screenshot="captura.png" "http://127.0.0.1:5173/"
```

El viewport de referencia es **1280px** (ahí `max-w-7xl` = 1280 y el diseño ocupa todo el ancho). El screenshot oficial mide 1280×5351; la implementación actual ronda los **4780px** de alto (el hero de dos columnas comparte altura entre texto y capturas).

Verificación rápida del layout del hero a 1280px: `#interfaz-en-vivo` debe quedar en `x≈660, y≈230, w≈596, h≈477` y el `<h1>` en `x≈24, y≈166, w≈596`.

> El diseño usa MD3 (azul `#003ec7`/`#0052ff`), **no** el Fluent POS Engine del escritorio. No mezclar sistemas.

---

## 9. Carrusel de capturas del hero (pedido explícito, excepción a Stitch)

`HeroMockup.tsx` ya no contiene el mockup HTML del terminal. Solo renderiza `ScreenshotCarousel`, que muestra las capturas reales de `public/imagen/` apiladas unas debajo de otras, replicando el efecto de **nexusposgobal.com**:

- Cada **4s** cambia de captura (`setInterval` + `setActive((i) => (i + 1) % screenshots.length)`).
- La tarjeta activa: `z-20 opacity-100` + `rotateX(15deg) rotateY(-15deg) rotateZ(5deg) translateZ(0)`.
- La inactiva: `z-10 opacity-30` + `translateZ(-180px) translateY(-90px) translateX(110px)`.
- Ambas con `transition-all duration-1000 ease-in-out`: la de arriba se oculta suavemente y la de abajo pasa al frente.
- Contenedor `[transform-style:preserve-3d] [perspective:1200px]`, `max-w-5xl aspect-[5/4]`; las capturas actuales son 1600×1280 y 1280×1053 y se ajustan con `object-contain`.
- Las dos primeras capturas se cargan con `loading="eager"` para que el relevo de 4s no muestre un hueco; el resto con `lazy`.
- Se respeta `prefers-reduced-motion` (no autodesplaza).

**Capturas actuales (5):** `/imagen/novusposventa.png` (ventas), `/imagen/novuspos_producto.png` (productos), `/imagen/novuspos_kardex.png` (Kardex), `/imagen/novus_caja.png` (caja) y `/imagen/novus_cliente.png` (clientes), en ese orden. El relevo de 4s rota sobre todas. `ScreenshotSlide` admite `fit?: 'contain' | 'cover'`: por defecto `object-contain`, pero `novus_caja.png` (1280×1384, más alta que el contenedor 5:4) usa `fit: 'cover'` → `object-cover object-top` para llenar el recorte sin dejar bandas laterales; se recorta la parte baja, no la cabecera. Si se agrega otra captura alta, usar el mismo `fit: 'cover'`.

**Para agregar más:** coloca el PNG en `public/imagen/` y añade una entrada al array `screenshots` en `landing-data.tsx`:

```tsx
export const screenshots: ScreenshotSlide[] = [
  { src: '/imagen/novusposventa.png', alt: 'Terminal de ventas NovusPOS' },
  { src: '/imagen/novuspos_producto.png', alt: 'Catálogo e inventario' },
  { src: '/imagen/novuspos_kardex.png', alt: 'Kardex y auditoría' },
  { src: '/imagen/novus_caja.png', alt: 'Caja y corte Z', fit: 'cover' },
  { src: '/imagen/novus_cliente.png', alt: 'Clientes y créditos' },
  { src: '/imagen/nueva-captura.png', alt: 'Nueva captura' }, // ← nueva
]
```

El ancla `#interfaz-en-vivo` se conserva en el contenedor del carrusel, ahora ubicado en la **columna derecha del hero** (`HeroHeader` usa `lg:grid-cols-2 items-center gap-space-xl`; en móvil el carrusel baja con `mt-space-lg`).

---

## 10. Copy verificado contra el sistema (excepción 2 a Stitch)

`KeyFeatures.tsx` es solo el renderizador; las 6 tarjetas viven en `features` (`landing-data.tsx`). Ese array y `shortcuts` se auditaron contra `novus-post/docs/context/00-MASTER-CONTEXT.md` y los contextos **02 (POS), 03 (Inventario), 04 (Kardex), 05 (Caja), 06 (Clientes) y 08 (Ajustes/Hardware)**. Donde el HTML de Stitch contradecía al sistema, prevalece la documentación:

| Antes (Stitch) | Ahora (sistema real) | Fuente |
| :--- | :--- | :--- |
| Atajos `F1-F7` | `ALT+1`…`ALT+7` para navegar; `F2`, `F6`, `F7`, `F8`, `F12`, `ALT+Q`, `ALT+P`, `ALT+E` en POS | 00 §5, 02 §3 |
| Cobro mixto = "efectivo, tarjeta, crédito" | Cuatro medios: efectivo, tarjeta, **mixto (`F8`, efectivo+tarjeta)** y crédito | 02 §1, §4 |
| "Latencia por escaneo < 0.8ms" | "Búsqueda paginada y cobro transaccional SQLite" (sin métrica inventada) | — |
| "Papelera de reciclaje" | Baja lógica (`deleted=1, active=0`) que preserva Kardex | 03 §4.1, 00 §3.4 |
| `ALT+E` = "entradas directas" | `ALT+E` = entradas masivas; `ALT+S` = salidas por merma | 03 §3 |
| EAN-13/Code128, etiquetas DPI | 7 simbologías (EAN-13/8, UPC-A, ITF-14, Code128, Code39, OTRO) y mm | 03 §1, §4.8 |
| "Segundo a segundo", exportación Excel | Fecha/hora exacta, append-only, XLSX y PDF de todos los filtrados | 04 §1, §5 |
| `Fondo + Ventas + Abonos - Gastos`, "cierre ciego" | `Fondo + Ventas + Abonos + Ingresos manuales - Gastos - Devoluciones en efectivo`; sobrante/faltante en vivo; tarjeta y crédito excluidos | 05 § "Reglas operativas" |
| "Probada con CAS", "COM1-COM8", "COM/USB" | Torrey, Rhino y Dibal; puerto COM + baudios persistidos; validación física pendiente | 08 §1 |
| "compras fadas", recibo de abono impreso | "compras fiadas"; abono a deudas más antiguas con impacto en gaveta (ESC/POS no conectado) | 06 §1/§6, 08 §1 |
| "hasta 500,000 transacciones mensuales" | "alto volumen transaccional" | — |

`KeyboardCheatSheet.tsx` también mostraba `F1`–`F5` como navegación; ahora usa `ALT+1`…`ALT+7`, `F12` → "Cobro Estándar" y `ALT+Q`. `KeyCap` aplica `px-2 text-[13px]` cuando la tecla tiene más de 3 caracteres para que `ALT+1` quepa sin desbordar, conservando el color del variante.

> Si en el futuro se vuelve a sincronizar con Stitch, **no restaurar estos textos**: la fidelidad visual se sacrificó deliberadamente por veracidad funcional en el hero (§9), las tarjetas y atajos (§10) y la tabla y FAQ (§11).

---

## 11. Tabla comparativa y FAQ verificadas (excepción 3 a Stitch)

`ComparisonTable.tsx` renderiza `comparisonRows` y `HardwareFaq.tsx` renderiza `faqs`; ambos arrays viven en `landing-data.tsx`. Se auditaron contra los contextos **00, 01, 02, 05 y 08**:

| Antes (Stitch) | Ahora (sistema real) | Fuente |
| :--- | :--- | :--- |
| "✓ 100% Ininterrumpido (SQLite Local Nativo)" | "✓ Núcleo POS offline-first con SQLite local en modo WAL" (bootstrap/OTP, reportes y tasas BCV sí requieren red) | 00 §1/§3.7, 01 §1/§4, 02 §4 |
| "~0.5 a 1.2 ms" / "300–2500 ms" | "✓ Búsqueda local paginada en SQLite (50 por página), sin viaje de red" | 02 §1, §5.14 |
| "Conexión directa a puertos COM nativos" | "✓ Lectura serial con puerto COM y baudios configurables (Torrey, Rhino, Dibal)" | 08 §1 |
| "✓ ESC/POS directo al puerto RAW sin diálogo de Windows" | "✓ PDF vectorial nativo 80mm/58mm/Carta con descarga directa" | 02 §1, 08 §1/§6 |
| FAQ: "cualquier impresora ESC/POS vía USB/Serial/Red", CAS, BAR-9 | PDF vectorial + diálogo nativo para etiquetas (no ESC/POS/ZPL); Torrey/Rhino/Dibal por RS-232, validación física pendiente | 08 §1/§6 |
| FAQ: Windows 10/11, i3, 4 GB RAM, 250 MB, VFD | Electron, Fluent/WinUI 3, SQLite local y ventana mínima 960×600; sin cifras oficiales de CPU/RAM/disco | 00 §1/§3.7 |
| FAQ: "escribe de manera atómica e **instantánea** ... si se corta la energía ningún registro queda a medias" | "se confirma en una transacción atómica y queda persistido en el disco local"; sin garantía de durabilidad ante corte de luz | 00 §1, 02 §113 |
| FAQ: "**sin dependencia de un servidor** en la fase monopuesto" | "cobro, inventario y caja operan sin servidor; primer ingreso, OTP, reportes y tasas BCV sí requieren conexión" | 01 §1/§4, 00 §3.7, 02 §4 |

La fila de precio ($4.99/mes, primer mes gratis) se conserva: es una decisión comercial documentada en `09-LANDING-WEB.md`, no una afirmación técnica del sistema.

> Regla futura: todo copy que mencione hardware o rendimiento debe verificarse en `08-SETTINGS-HARDWARE.md` y `02-POS-SALES.md` antes de copiarlo de Stitch.

---

## 12. Pricing verificado (excepción 4 a Stitch)

`Pricing.tsx` conserva el precio comercial (`$4.99 USD / mes`, `PRIMER MES $0`, `30 días gratis`, sin tarjeta). El número de versión y el tamaño del instalador se retiraron del copy (ver §14.2). El checklist y la línea de Windows sí se auditaron contra los contextos **00, 01, 02, 04, 05 y 08**:

| Antes (Stitch) | Ahora (sistema real) | Fuente |
| :--- | :--- | :--- |
| "Para Windows 11 / 10 x64" | "Para Windows 10 o Windows 11" (Windows 10 reincorporado en §14.1: Electron 39 lo admite) | `novus-post/package.json`, `electron-builder.yml` |
| "SQLite integrada de ultra-alto rendimiento" | "SQLite integrada y operación offline-first" | 00 §1 |
| "Productos y transacciones ilimitadas sin ralentización" | "Catálogo y transacciones sin costos por volumen ni comisiones" | — (claims de precio, no de rendimiento) |
| "Impresoras térmicas ESC/POS de 58/80mm y cajón de dinero" | "Básculas RS-232 (Torrey, Rhino, Dibal) y tickets PDF 80/58mm; ESC/POS y gaveta aún no integrados" | 08 §1/§6, 02 §4 |
| "Corte Z, control de caja y Kardex inmutable" | Sin cambios | 04, 05 |
| "Actualizaciones continuas v2.x y soporte prioritario por WhatsApp y Ticket" | "Soporte por ticket desde la app (requiere internet)" | 00 §3.7, 08 §1 |
| "Copias de seguridad automáticas a memorias USB o carpetas compartidas" | "Respaldo verificado con SHA-256 en la carpeta de datos de la app, con restauración y copia preventiva" | 08 §1/§6 |

> No restaurar estos textos en una futura sincronización con Stitch: las excepciones deliberadas son hero (§9 y §13), tarjetas/atajos (§10), tabla/FAQ (§11), precios (§12) y footer (§13).

---

## 13. Hero y footer verificados (excepción 5 a Stitch)

`HeroHeader.tsx` (además del carrusel de §9) y `Footer.tsx` se auditaron contra los contextos **00, 01, 02, 08 y 09**:

| Antes (Stitch) | Ahora (sistema real) | Fuente |
| :--- | :--- | :--- |
| Badge "Instalador Nativo x64" | "Instalador nativo para Windows" (x64 no documentado) | 00 §1 |
| Badge "Sin caídas por internet" | "Núcleo offline-first" (bootstrap/OTP, reportes y BCV sí requieren red) | 00 §3.7, 01 §1/§4, 02 §4 |
| H1 "más rápido ... sin ataduras a la nube" | "rápido, confiable y con núcleo offline-first" (sin superlativo ni absoluto) | — |
| "Procesa transacciones en milisegundos ... Opera 100% sin conexión" | "Cobro, inventario y caja sobre SQLite local con transacciones atómicas. El núcleo opera sin internet; el primer ingreso, la recuperación OTP, los reportes y las tasas BCV sí lo requieren" | 00 §1, 01 §1/§4, 02 §4 |
| "Imprime tickets térmicos ESC/POS de 80mm" | "Tickets PDF 80/58mm" (ESC/POS no integrado) | 08 §1/§6, 02 §4 |
| "Básculas RS-232" (sin matiz) | "Torrey, Rhino y Dibal, pendiente de validación física" | 08 §1/§6 |
| CTA "Ver Demostración" | "Ver capturas del sistema" (el ancla es un carrusel de capturas, no una demo) | §9 |
| Footer: "offline-first de ultra-alto rendimiento" | "offline-first con SQLite local" | 00 §1 |

El precio y los beneficios de la prueba (`30 días gratis`, sin tarjeta) se conservan por ser decisiones comerciales; la versión y el tamaño del instalador ya no se muestran (§14.2).

---

## 14. Copy positivo para el usuario final (excepción 6, pedido explícito)

El criterio actual de **toda la landing** es explicar *qué puede hacer el negocio*, no *cómo está implementado*. Aplica a hero, `KeyFeatures`, `shortcuts`, comparativa, FAQ, precios, CTA final, footer y `index.html` (meta description).

| Concepto | Texto que NO se debe usar | Texto vigente |
| :--- | :--- | :--- |
| Datos sin internet | "SQLite nativo en modo WAL", "transacción atómica persistida", "se guarda en el ordenado" | "Todo queda registrado al momento y sigue disponible cuando vuelves a abrir el programa, incluso sin conexión" |
| Básculas | "pendiente de validación física", "puerto COM y baudios persistidos" | "Toma el peso directamente en la venta, sin digitar los gramos. Compatible con Torrey, Rhino y Dibal" |
| Impresión | "aún no están integrados", "no ESC/POS ni ZPL" | "Tickets en 80 mm, 58 mm o carta, listos para descargar" |
| Requisitos | "No hay cifras oficiales de CPU, RAM o espacio en disco" | "NovusPOS funciona en Windows 10 y Windows 11 (en computadoras de 64 bits), así que no necesitas la versión más reciente para empezar" |
| Seguridad | "Respaldo verificado con SHA-256 en la carpeta de datos" | "Respaldos de tu información y restauración cuando lo necesites" |
| Footer | "Servidores Cloud Sincronizados", "Certificación Fiscal", "Drivers OPOS", "arquitectura Windows x64", "Mesa de Ayuda 24/7" | "Tu negocio, siempre disponible", "Protección de datos", "Centro de ayuda", "Básculas y periféricos" |

Titulares vigentes: hero `rápido, confiable y siempre disponible`; características `PENSADO PARA TU DÍA A DÍA` / `Todo para vender, controlar tu inventario y cerrar el día con confianza`; comparativa `NOVUSPOS FRENTE A UN POS EN NUBE` / `¿Por qué elegir NovusPOS para tu negocio?`. Los atajos `'Modal de pago'` y `'1-Click ticket directo'` pasaron a `'Ventana de cobro'` y `'Cobro en un clic'`.

> Regla: se mantiene la **veracidad funcional** (no se afirma impresión térmica conectada ni rendimiento inventado), pero se expresa en lenguaje de negocio. Si en el futuro se sincroniza con Stitch, **no restaurar** ninguno de estos textos. `Kbd` ya no se importa en `landing-data.tsx`: las descripciones de tarjetas son prosa, sin atajos inline.

### 14.1 Compatibilidad con Windows (excepción a "solo Windows 11")

El FAQ `¿Qué necesito para empezar?` y la línea de `Pricing` indican **Windows 10 o Windows 11**. Evidencia verificada en el proyecto de escritorio `novus-post/`:

- `package.json`: `electron: ^39.2.6` (resuelto `39.8.10` en `package-lock.json`). El README oficial de Electron 39 indica: *"Windows (Windows 10 and up)"* y que el soporte para Windows 7/8/8.1 se eliminó en Electron 23.
- `electron-builder.yml`: `nsis.artifactName: NovusPOS-Setup-${version}-x64.exe` → instalador de **64 bits**.
- No hay ningún chequeo en el código que exija Windows 11; "Windows 11 Fluent Design / WinUI 3" en los contextos 00 y AGENTS.md es **estilo visual**, no requisito de sistema operativo.

Por eso el texto dice que no hace falta la versión más reciente, pero **no menciona Windows 7/8/8.1** (no son compatibles). Si cambia la versión de Electron o el target del instalador, revisar este apartado antes de tocar el copy.

### 14.2 Sin número de versión en la landing (pedido explícito)

Se retiró `2.4.0` de **todo** el copy visible porque se veía mal. `ReleasePill` pasó a llamarse `HighlightPill` y ahora dice `⚡ TRABAJA SIN DEPENDER DE INTERNET`. Los subtítulos de los botones de descarga (hero y `Pricing`) y la línea del CTA final pasaron a `30 días gratis • sin tarjeta`. La columna de la comparativa dice solo `NovusPOS Desktop` y el enlace del footer dice `Novedades`. No reintroducir `v2.4.0`, `Versión 2.4.0`, `~85 MB` ni `(.exe)` en la landing: la versión real sigue viviendo en `novus-post/package.json` y en el nombre del artefacto de `electron-builder.yml`, no en el sitio web.

---

## 15. Sección de productos (excepción 7, pedido explícito)

`ProductCatalog.tsx` añade `#productos` entre `#caracteristicas` y la comparativa, con enlace en `SiteHeader`. No existe en el HTML de Stitch: se creó a pedido del usuario para explicar **qué tipos de productos se pueden administrar**, con texto concreto y tono humano (sin fórmulas tipo "Descubre", "Potencia", "En resumen" ni "Además").

Contenido en `landing-data.tsx`, arrays `productGroups` (4 tarjetas) y `productCapabilities` (6 datos de ficha). Fuente real: `novus-post/docs/context/03-INVENTORY-PRODUCTS.md` y `src/main/adapters/persistence/sqlite/migrations/006_seed_products.ts`.

| Tarjeta | Ejemplo visible | Respaldado por |
| :--- | :--- | :--- |
| Lo de todos los días | Abarrotes, refrescos, lácteos, panadería, limpieza, cuidado personal, frutas y verduras | 8 categorías sembradas en `006_seed_products.ts` |
| Por pieza, por caja o por peso | Aguacate 1,450 kg, caja de 12 refrescos, detergente por litro | unidades `PIEZA`/`CAJA`/`KG`/`L` + `allow_decimal` |
| Tallas, colores y presentaciones | Camiseta talla M azul, botella 600 ml / 1,5 L | variantes con `attribute_name`/`attribute_value` |
| Combos, servicios e insumos | Combo desayuno, envío a domicilio, materia prima | `product_type` COMBO/SERVICE/INSUMOS + `combo_items` |

Capacidades: códigos de barras, costo y ganancia, precios por mayoreo, impuestos por producto, lotes y caducidad, existencias y avisos. Se dice *qué hace*, nunca *cómo está implementado*: no aparecen `SKU`, `FEFO`, SQLite, `append-only`, `soft delete` ni IDs de impuestos. "Los productos que vencen primero son los que se descuentan primero" es la versión en lenguaje de negocio del descarte FEFO.

> Si cambia el módulo de productos en `novus-post`, revisar este apartado antes de tocar el copy. Mantener los ejemplos concretos: son los que hacen que el texto no parezca generado.

