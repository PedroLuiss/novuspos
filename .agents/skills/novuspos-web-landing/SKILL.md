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
│   │   ├── HeroHeader.tsx              # MS + ReleasePill + cabecera del hero
│   │   ├── HeroMockup.tsx              # wrapper del carrusel (antes: mockup HTML del POS)
│   │   ├── ScreenshotCarousel.tsx      # carrusel 3D apilado, relevo suave estilo NexusPOS
│   │   ├── product/ProductCard.tsx     # ProductCard + CartRow (sin uso tras el carrusel)
│   │   ├── Kbd.tsx                     # atajo inline <strong class="font-mono">
│   │   ├── Hero.tsx                    # glow + HeroHeader + HeroMockup
│   │   ├── KeyFeatures.tsx             # 6 tarjetas (#caracteristicas)
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
2. `Hero` — glow; **grid de 2 columnas en desktop**: izquierda = píldora "⚡ NUEVA VERSIÓN 2.4.0 • …", headline, "Lema oficial", subtítulo, CTAs y 4 trust badges (alineados a la izquierda); derecha = carrusel de capturas (#interfaz-en-vivo), movido de abajo hacia arriba. En móvil se apila (texto arriba, capturas abajo).
3. `KeyFeatures` (`#caracteristicas`) — 6 tarjetas con copy verificado contra los contextos 02–06 y 08 (ver §10).
4. `KeyboardCheatSheet` — 7 atajos reales (`ALT+1`…`ALT+7`, `F12`, `ALT+Q`).
5. `ComparisonTable` — 5 filas con copy verificado contra contextos 01, 02, 05 y 08 (ver §11).
6. `Pricing` (`#precios`)
7. `HardwareFaq` — 3 preguntas; periféricos y requisitos corregidos según docs (ver §11).
8. `FinalCta` (`#descargar`)
9. `Footer`

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
- Contenedor `[transform-style:preserve-3d] [perspective:1200px]`, `max-w-5xl aspect-[5/4]` (la imagen fuente es 1600×1280).
- Se respeta `prefers-reduced-motion` (no autodesplaza).

**Para agregar capturas:** coloca el PNG en `public/imagen/` y añade una entrada al array `screenshots` en `landing-data.tsx`:

```tsx
export const screenshots: ScreenshotSlide[] = [
  { src: '/imagen/novusposventa.png', alt: 'Terminal de ventas NovusPOS' },
  { src: '/imagen/novuspos-inventario.png', alt: 'Catálogo e inventario' }, // ← nueva
]
```

Con una sola imagen el efecto no se aprecia (no hay relevo), pero el componente ya está listo. El ancla `#interfaz-en-vivo` se conserva en el contenedor del carrusel, ahora ubicado en la **columna derecha del hero** (`HeroHeader` usa `lg:grid-cols-2 items-center gap-space-xl`; en móvil el carrusel baja con `mt-space-lg`).

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
| FAQ: Windows 10/11, i3, 4 GB RAM, 250 MB, VFD | Electron 64 bits, Fluent/WinUI 3, SQLite local y ventana mínima 960×600; sin cifras oficiales de CPU/RAM/disco | 00 §1/§3.7 |

La fila de precio ($4.99/mes, primer mes gratis) se conserva: es una decisión comercial documentada en `09-LANDING-WEB.md`, no una afirmación técnica del sistema.

> Regla futura: todo copy que mencione hardware o rendimiento debe verificarse en `08-SETTINGS-HARDWARE.md` y `02-POS-SALES.md` antes de copiarlo de Stitch.
