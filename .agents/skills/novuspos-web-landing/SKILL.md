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
>
> ⚠️ **Excepción 8 (vistas de auth):** se replicó la pantalla de Stitch "Iniciar Sesión / Registro - NovusPOS" como `/auth` y `/auth/login`. Layout idéntico; copy auditado con las reglas §14/§14.2. Ver §16.
>
> ⚠️ **Excepción 9 (panel de control):** se replicó "Panel de Control de Clientes - NovusPOS" como `/panel`. Layout idéntico (sidebar 64 + header + bento grid), copy auditado. Ver §17.

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
├── App.tsx                             # rutas: /auth | /auth/login → AuthPage; /panel → PanelPage
├── app/LandingPage.tsx                 # SiteHeader + <main class="pt-20"> + secciones + Footer
├── app/AuthPage.tsx                    # split 5/7 + barra inferior de confianza
├── app/PanelPage.tsx                   # sidebar + header + portada o uno de los tres módulos
├── features/panel/                     # PanelSidebar + data/ (navegación del panel)
├── features/dashboard/                 # Portada: clave, suscripción y último respaldo
├── features/subscription/              # Planes, pagos e historial
├── features/backups/                   # Única copia vigente de la cuenta
├── features/support/                   # Formulario de reportes de soporte
├── shared/services/exchange-rate/     # tasa BCV real: API pública + Laravel opcional + caché/respaldo
├── shared/hooks/useExchangeRate.ts    # carga de la tasa del día
├── shared/ui/MS.tsx                    # icono Material Symbols (filled opcional)
├── shared/ui/FormFields.tsx            # FieldShell / TextField / PasswordField / SelectField reutilizables
├── features/auth/
│   ├── components/AuthBrandPanel.tsx   # columna izquierda (logo blanco, métricas, beneficios)
│   ├── components/AuthFormPanel.tsx    # columna derecha (tabs, formularios, accesos)
│   ├── components/AuthFields.tsx       # re-export de shared/ui/FormFields (compatibilidad)
│   ├── components/RegisterForm.tsx     # registro con licencia de prueba
│   ├── components/LoginForm.tsx        # inicio de sesión con perfil
│   └── data/auth-data.ts              # beneficios, sectores, perfiles y confianza
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
│   │   ├── Pricing.tsx                 # planes mensual $4.99 y anual $59.99 (#precios)
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
7. `Pricing` (`#precios`) — planes mensual $4.99 y anual $59.99; checklist verificado (ver §12).
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

La fila de precio muestra las dos opciones comerciales ($4.99/mes o $59.99/año, primer mes gratis en el plan mensual): es una decisión comercial documentada en `09-LANDING-WEB.md`, no una afirmación técnica del sistema.

> Regla futura: todo copy que mencione hardware o rendimiento debe verificarse en `08-SETTINGS-HARDWARE.md` y `02-POS-SALES.md` antes de copiarlo de Stitch.

---

## 12. Pricing verificado (excepción 4 a Stitch)

`Pricing.tsx` conserva los precios comerciales (`$4.99 USD / mes` con `PRIMER MES $0` y `30 días gratis`, y `$59.99 USD / año` con un solo pago al año), sin tarjeta. Las dos tarjetas comparten el mismo checklist y CTA; no se afirma ahorro porque 12 mensualidades cuestan menos que el plan anual. El número de versión y el tamaño del instalador se retiraron del copy (ver §14.2). El checklist y la línea de Windows sí se auditaron contra los contextos **00, 01, 02, 04, 05 y 08**:

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

Contenido en `landing-data.tsx`, arrays `productGroups` (4 tarjetas), `productVarieties` (8 categorías con ejemplos concretos) y `productCapabilities` (6 datos de ficha). Fuente real: `novus-post/docs/context/03-INVENTORY-PRODUCTS.md` y `src/main/adapters/persistence/sqlite/migrations/006_seed_products.ts`. El bloque "Así se ve el catálogo de un abasto" muestra 33 productos con su medida (gaseosa 600 ml, huevo 12 piezas, detergente 1 kg, aguacate…) para que se aprecie la variedad que se puede manejar; son nombres del catálogo de ejemplo del sistema, acortados para que se lean bien en una etiqueta.

| Tarjeta | Ejemplo visible | Respaldado por |
| :--- | :--- | :--- |
| Lo de todos los días | Abarrotes, refrescos, lácteos, panadería, limpieza, cuidado personal, frutas y verduras | 8 categorías sembradas en `006_seed_products.ts` |
| Por pieza, por caja o por peso | Aguacate 1,450 kg, caja de 12 refrescos, detergente por litro | unidades `PIEZA`/`CAJA`/`KG`/`L` + `allow_decimal` |
| Tallas, colores y presentaciones | Camiseta talla M azul, botella 600 ml / 1,5 L | variantes con `attribute_name`/`attribute_value` |
| Combos, servicios e insumos | Combo desayuno, envío a domicilio, materia prima | `product_type` COMBO/SERVICE/INSUMOS + `combo_items` |

Capacidades: códigos de barras, costo y ganancia, precios por mayoreo, impuestos por producto, lotes y caducidad, existencias y avisos. Se dice *qué hace*, nunca *cómo está implementado*: no aparecen `SKU`, `FEFO`, SQLite, `append-only`, `soft delete` ni IDs de impuestos. "Los productos que vencen primero son los que se descuentan primero" es la versión en lenguaje de negocio del descarte FEFO.

> Si cambia el módulo de productos en `novus-post`, revisar este apartado antes de tocar el copy. Mantener los ejemplos concretos: son los que hacen que el texto no parezca generado.

---

## 16. Vistas de Iniciar Sesión / Registro (excepción 8, pedido explícito)

Pantalla de Stitch: `projects/14269822984035378146/screens/b7520097c4d14ab9913cf7ab915c00cd`, título **"Iniciar Sesión / Registro - NovusPOS"**, DESKTOP 2560×2048. HTML: `files/b7520097c4d14ab9913cf7ab915c00cd` (28.5 kB). Se bajó con `tools.stitch.download_file` desde `list_screens` del proyecto conocido. Es la fuente de verdad de clases, orden y tokens (el screenshot de Stitch no sirve de referencia tipográfica; ver §1).

**Rutas:** `/auth` abre registro (estado por defecto en Stitch) y `/auth/login` abre login. `App.tsx` decide por `window.location.pathname`; no hay hook de ruta ni `hashchange`. El header "Iniciar Sesión" apunta a `/auth/login`. El `#` queda reservado para anclas internas de la landing (`#productos`, `#descargar`, …), que se enlazan como `/#productos` desde auth/panel. **No reintroducir `/#/auth/login`**: el doble `#` es un fragmento con barra, no una ruta, y puede fallar en hosting o al compartir enlaces.

**Layout (idéntico a Stitch):** body `bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-center items-center`; `main w-full flex items-center justify-center p-space-md`; contenedor `max-w-7xl my-auto py-space-md lg:py-space-xl`; tarjeta `grid grid-cols-1 lg:grid-cols-12 rounded-xl shadow-xl overflow-hidden bg-surface-container-lowest`; columna izquierda `lg:col-span-5` con gradiente `from-primary-container via-primary to-on-secondary-fixed`; derecha `lg:col-span-7`. Se conservan los dos blur decorativos, el sparkline SVG, los 3 beneficios, la tarjeta de garantía, los 4 items de la barra inferior, los tabs, el banner verde, los dos formularios, el divisor y los dos botones alternos.

**Assets:** `public/novuspos-logo-white.png` se generó desde `novuspos-logo.png` (que tiene fondo blanco opaco) poniendo transparente lo cercano a blanco y blanco el resto. El `brightness-0 invert` de Stitch convertía todo el PNG en un rectángulo blanco; no reintroducirlo.

**Copy auditado (no restaurar el de Stitch):**

| Stitch | Implementado |
| :--- | :--- |
| `VERSIÓN 2025.2 READY · DESKTOP + NUBE` | `LISTO PARA WINDOWS · TRABAJA SIN INTERNET` |
| `+40% Velocidad`, `1.8 seg`, `100% Uptime` | `Sin depender de internet`, `Al instante`, `Siempre listo` |
| Testimonial inventado (40% menos filas, 5 min, nunca se traba) | Tarjeta "Prueba sin riesgo" con datos reales de la prueba |
| "Compatibilidad nativa con impresoras térmicas", "Cancela en un clic", "migración sin cargo" | Básculas y tickets listos; sin tarjeta y sin comisiones; soporte desde la app |
| `Seguridad Bancaria TLS 1.3`, `Cifrado SSL 256-bit` | `Tu información se queda en tu equipo`, `Tus datos protegidos` |
| `Compatible con Tickets ESC/POS`, `Sincronización en la Nube` | `Tickets listos para imprimir`, `Respaldos de tu información` |
| Botones Google Workspace / Microsoft 365 | `Descargar para Windows` y `Ver capturas del sistema` |
| "Caja / Terminal Asociada" con 3 cajas | Campo eliminado: el login solo pide correo y contraseña |

Los formularios son **demostrativos**: `onSubmit` solo muestra una alerta; no existe backend de auth en la landing. `MS` se movió a `shared/ui/MS.tsx` (con `filled` para `speed` y `workspace_premium`) para que landing y auth no se importen entre sí.

> Al sincronizar con Stitch, conservar el layout y volver a aplicar esta tabla. No reintroducir versión, nube, ESC/POS, TLS, SSO ni métricas inventadas. Tampoco reintroducir el selector de "Perfil de acceso": el login solo envía `email` y `password` a `POST /auth/login`. Verificado con Chrome headless a 1280px en ambos modos.

---

## 17. Panel de Control de Clientes (excepción 9, pedido explícito)

Pantalla de Stitch: `projects/14269822984035378146/screens/98a61d2fa58e4476ab0d250be8a57755`, título **"Panel de Control de Clientes - NovusPOS"**, DESKTOP 2560×3558. HTML: `screens/98a61d2fa58e4476ab0d250be8a57755/fileEntries/html` (37.8 kB), bajado con `tools.stitch.download_file`.

**Ruta:** `/panel` (el alert de login exitoso incluye "Abrir panel de control"). `PanelPage` = `PanelSidebar` (aside `fixed left-0 top-0 h-full w-64` + header `fixed top-0 left-64 right-0 h-16`) + `<div class="pl-64"><main class="relative pt-16 ...">` con `p-space-md lg:p-space-lg gap-space-lg`. La portada muestra solo `DashboardSection`; los módulos viven en `/panel/suscripcion`, `/panel/respaldos` y `/panel/soporte`. El menú tiene cuatro items: ya no está *Cajas Registradoras* y *Soporte Técnico* apunta a su propia ruta.

**Layout idéntico:** mismos `shadow-sm`, `rounded-xl`, `bg-surface-container-lowest`, `blur-3xl`, `hover:translate-y-[-2px]`, `divide-y divide-surface-container`, `animate-pulse` y tipografías `numeric-keypad`/`font-mono`. El icono del sidebar usa `novuspos-icon.png` (recorte 140×141 del logo) para no duplicar el texto "NovusPOS" junto a "Novus Portal".

**Copy auditado:** se retiraron `Build 2.4.0 Production`, `Descargar NovusPOS v2.4.0`, `NovusPOS-Setup-2.4.0-x64.exe (64.8 MB)`, `(.EXE)`, `MD5: ...`, `Versión 2.4.0 Estable`, `ESC/POS`, `RS-232`, `SQLite`, `Zstandard`, `AES-256`, "sincronización con la nube", `Auto-Sync`, `Offline-Ready`, `REG-WIN11-04`, `24/7 Disponible`, `Soporte VIP`, `Caja Central #1`, `Sincronizando ahora` y `ID: #8829`. Tampoco se muestran los KPIs de Stitch (*Mi Suscripción*, *Tu Equipo de Cobro*, *Último Respaldo*, *Soporte y Garantía*) ni el bloque de equipo asignado (*Nombre PC*, *Sistema Operativo*, *Equipo*, *Lista para usar*, *Cambiar equipo*): la clave de suscripción válida activa todo el sistema de escritorio. La clave se muestra **completa y copiable** (la envía la API y cambia con cada pago); no se enmascara. Ver §22–§25.

> Al sincronizar con Stitch, conservar el layout y volver a aplicar estos reemplazos. Verificado con Chrome headless a 1280px.

---

## 18. Capa HTTP y sesión global

`src/shared/services/apiClient.ts` usa **fetch nativo** (no añadir axios): `API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'`, inyección de `Authorization: Bearer` leyendo el token en cada petición, y errores tipados `ApiError` / `UnauthorizedError` / `ValidationError`. En 401 se limpia la sesión y se redirige a `/auth/login`; en 422 se normalizan `issues` de FastAPI (`detail[].loc/msg`) y Laravel/Express (`errors`); en 500 se devuelve un mensaje genérico. `setUnauthorizedHandler` permite que el provider limpie el estado sin acoplar `apiClient` al contexto; `subscribeLoading` alimenta `isLoading`.

`src/shared/context/AuthContext.tsx` (provider) + `auth-context.ts` (definición, para fast refresh) + `src/shared/hooks/useAuth.ts`. El estado `session` se inicializa de forma **síncrona** desde `localStorage` (cookie como respaldo del token), así que no hay parpadeo al recargar. Métodos: `login(token,user)`, `logout()`, `updateUser(partial)`. Usuario: `{ id, email, organizationName, role }`.

`src/shared/components/ProtectedRoute.tsx` muestra un skeleton MD3 (`progress_activity` + barra `animate-pulse`) mientras `isLoading` o no hay sesión; la redirección se hace en `useEffect` con `window.location.replace('/auth/login')`. `App.tsx` envuelve `/panel` con él. `main.tsx` monta `<AuthProvider>`. El login real usa `POST /auth/login` → `{ token, user }` y el sidebar ofrece logout. `vite-env.d.ts` y `.env.example` documentan `VITE_API_URL`.

> El registro sigue siendo demostrativo hasta que exista `POST /auth/register`. No mover la definición del contexto dentro de `AuthContext.tsx`: oxlint `only-export-components` avisa y rompe fast refresh.

---

## 19. Patrones de diseño y SOLID (regla para todo el front)

La capa de sesión se refactorizó para que **cada módulo tenga una sola razón de cambio**. Mantener esta separación al añadir código:

| Patrón | Dónde | Responsabilidad |
| :--- | :--- | :--- |
| **Facade** | `src/shared/services/apiClient.ts` | Única API pública (`get/post/...`, errores y eventos re-exportados). El resto de la app **nunca** importa `services/http/*`. |
| **Transport** | `src/shared/services/http/transport.ts` | Solo `fetch`, Bearer y traducción de códigos HTTP. |
| **Error type + parser** | `src/shared/services/http/errors.ts` | Errores tipados y normalización de 422. |
| **Observer / event bus** | `src/shared/services/http/events.ts` | `unauthorized` y contador de peticiones en curso; desacopla HTTP del provider. |
| **Repository (DIP)** | `src/shared/lib/auth-storage.ts` | Interfaz `SessionStore` + implementación `sessionStore`; `AuthProvider` acepta `store` inyectable. |
| **Use case + Gateway (DIP)** | `src/features/auth/services/authService.ts` | `AuthGateway` (puerto), `httpAuthGateway` (adaptador) y `loginUseCase.execute`. |
| **Presentational / Container** | `AuthFormPanel` (presentacional) + `useLogin` (container) | El panel solo renderiza; el hook orquesta loader, errores y navegación. |
| **Guard** | `src/shared/components/ProtectedRoute.tsx` | Único lugar que decide si se renderiza una ruta privada. |
| **Route resolver** | `src/app/routeResolver.ts` | Función pura `resolveAppRoute(pathname)`; `App` solo compone. |
| **Context + hook** | `auth-context.ts` / `AuthContext.tsx` / `useAuth.ts` | Definición, provider y consumidor separados (fast refresh + SRP). |

Reglas derivadas:

- **SRP:** un archivo = una responsabilidad. Si un componente empieza a parsear errores o a navegar, extrae un hook o un caso de uso.
- **OCP:** para cambiar el backend basta otro `AuthGateway`; para cambiar la persistencia, otro `SessionStore`. No tocar UI.
- **LSP:** cualquier `AuthGateway`/`SessionStore` debe cumplir la interfaz sin condicionar al consumidor.
- **ISP:** puertos pequeños (una sola operación en `AuthGateway`; cuatro en `SessionStore`).
- **DIP:** los módulos de alto nivel (hook, provider) dependen de interfaces, no de `fetch` ni de `localStorage`.
- Componentes ≤ 300 líneas, hooks ≤ 200. Contenido y tipos compartidos en `data/`, `types.ts`, `lib/`; nunca imports cruzados entre features.

> No reintroducir lógica de login dentro de `AuthFormPanel` ni llamadas directas a `fetch` desde componentes. Verificado: build/lint limpios y 422/401/protected route funcionando tras el refactor.

---

## 20. Modo demo y conexión a la API (API aún no lista)

El backend todavía no existe, así que el login tiene **dos adaptadores intercambiables** bajo el mismo puerto `AuthGateway` (§19):

- `demoAuthGateway` — sin red; acepta cualquier correo con `@` y contraseña de 4+ caracteres, simula 350 ms y devuelve `{ token: 'demo-token-*', user: { id, email, organizationName, role } }`. Valida con `ValidationError` para poder probar los mensajes de campo.
- `httpAuthGateway` — llama a `AUTH_ENDPOINTS.login` (`/auth/login`) mediante `apiClient` y espera `{ token, user }`.

`authGatewayFactory.resolveAuthGateway()` elige uno según `VITE_AUTH_MODE`:

```dotenv
# .env.example
VITE_API_URL=http://localhost:8000/api/v1
VITE_AUTH_MODE=demo   # demo | api
```

**Predeterminado: `demo`** (fallback cuando la variable no está definida). Para conectar al backend real, poner `VITE_AUTH_MODE=api` y la URL correcta; el comportamiento de la UI y del `AuthProvider` no cambia. Las rutas de la API viven en `src/shared/services/endpoints.ts` (`login`, `register`, `me`, `logout`).

`LoginForm` muestra un aviso *"Modo demostración: entra con cualquier correo y contraseña de 4 caracteres o más"* solo cuando `IS_DEMO_AUTH`; desaparece en modo `api`. El registro sigue demostrativo aunque exista `AUTH_ENDPOINTS.register`: no se introduce hasta que el backend lo implemente.

> Verificado: demo entra a `/panel` y muestra el email introducido; modo `api` con mock 422 muestra error general y por campo; build/lint limpios en ambos modos. Al terminar una prueba en modo `api`, reconstruir sin la variable para dejar el build por defecto en demo.

---

## 21. Recuperación de contraseña (2 pantallas de Stitch)

Screens de Stitch (mismo proyecto `14269822984035378146`):
- **Recuperar Contraseña - Solicitar Enlace** → `projects/14269822984035378146/screens/54dd58adf2904fa2b26ba64f3876d27d/fileEntries/html`
- **Restablecer Nueva Contraseña** → `projects/14269822984035378146/screens/57592e1e7d8241ec9751a890983bd430/fileEntries/html`

### Rutas limpias

| Ruta | Pantalla | Acceso |
| :--- | :--- | :--- |
| `/auth/recuperar` | Solicitar enlace | Link *"¿Olvidaste tu contraseña?"* del login |
| `/auth/restablecer?token=…&email=…` | Crear nueva contraseña | Solamente desde el enlace enviado al correo |

`resolveAppRoute` evalúa estas dos rutas **antes** del prefijo genérico `/auth`. `readRecoveryLinkParams(search)` (en `features/auth/lib/recoveryLink.ts`) es la única función que lee `token`/`email` de la query. Sin `token`, la tarjeta muestra un banner pidiendo un enlace nuevo.

### Estructura (mismos patrones de §19/§20)

```
app/ForgotPasswordPage.tsx              # layout + glows + cabecera + pie (Stitch)
app/ResetPasswordPage.tsx               # layout + glows + pie (Stitch)
features/auth/components/recovery/
  RequestResetCard.tsx                  # presentacional, tarjeta de solicitud
  ResetPasswordCard.tsx                 # presentacional, tarjeta de nueva clave
  PasswordRequirements.tsx              # medidor de fuerza + checklist
features/auth/lib/
  recoveryLink.ts                       # parseo/construcción del enlace (puro)
  passwordStrength.ts                   # analyzePassword / isStrongPassword (puro)
  formErrors.ts                         # toFormError compartido por los 3 hooks
features/auth/services/
  passwordRecoveryGateway.ts            # puerto: requestLink + reset
  demoPasswordRecoveryGateway.ts        # demo sin red (DEMO_RESET_TOKEN)
  httpPasswordRecoveryGateway.ts        # endpoints reales
  passwordRecoveryGatewayFactory.ts     # elige según VITE_AUTH_MODE
  passwordRecoveryService.ts            # requestPasswordResetUseCase / resetPasswordUseCase
features/auth/hooks/
  useForgotPassword.ts                  # container: loader, errores, banner de éxito
  useResetPassword.ts                   # container: reset + login + redirect a /panel
```

### Contrato de API (a implementar en el backend)

En `AUTH_ENDPOINTS` (`shared/services/endpoints.ts`):
- `POST /auth/forgot-password` con `{ email }` → responde 200/204. Errores 422 por campo se normalizan igual que login.
- `POST /auth/reset-password` con `{ token, email, password }` → responde `{ token, user }` (auto-login: el botón dice *"Restablecer y acceder a mi cuenta"*).

`email` viaja en la query del enlace y se reenvía al endpoint. Si el backend usa otro nombre de campo, cambiar **solo** `httpPasswordRecoveryGateway.ts`.

### Modo demo

`VITE_AUTH_MODE=demo` (predeterminado) no hace red: `requestLink` valida `@` y muestra el banner *"¡Enlace enviado!"*; dentro del banner aparece **"Abrir enlace de demostración →"** que lleva a `/auth/restablecer?token=demo-reset-token&email=…`. El reseteo exige 8 caracteres con mayúscula, minúscula, número y símbolo; al terminar entra a `/panel` con el correo introducido. En modo `api` ese enlace no aparece.

### Copy auditado (layout idéntico, texto honesto)

Se conservan clases y composición de Stitch, pero se sustituyen los textos falsos/técnicos: `TERMINAL AUTORIZADA • CLOUD GATEWAY` → `ACCESO SEGURO A TU CUENTA`; `Cifrado TLS 1.3 • Certificación PCI-DSS Compliant` → `Tus datos están protegidos`; `cifrado AES-256 de extremo a extremo` → `Tus credenciales se guardan de forma segura`; `Validando terminal…` → `Enviando enlace…`; `credencial de terminal` se elimina. Los enlaces de asistencia y legales llevan a `/` porque no hay páginas dedicadas.

**Tipo de Comercio (pedido explícito):** `businessSectors` en `auth-data.ts` enumera 14 perfiles de pymes venezolanas que el escritorio atiende realmente: Abarrotes y Minisúper, Bodega / Tienda de Barrio, Supermercado / Almacén, Ferretería y Materiales, Farmacia, Panadería y Pastelería, Frutería y Verdulería, Carnicería y Pescadería, Boutique y Moda, Calzado y Accesorios, Perfumería y Cosméticos, Librería y Papelería, Cafetería y Repostería y Comercio General. Se respaldan en kg/litro con báscula (02 §1), lotes con caducidad FEFO (03 §12), variantes de talla/color, combos y servicios (03 §9/§13) y cuentas corrientes (06). El `SelectField` inicia en *Selecciona el tipo de comercio* y es obligatorio; se añadió la prop `required` al componente compartido.

> Verificado: ambas pantallas renderizan sin los textos sensibles; flujo demo completa llega a `/panel`; sin `token` aparece el aviso; modo `api` con mock 422 muestra error general y por campo en ambos endpoints; el registro lista los 14 tipos con placeholder y campo obligatorio; build/lint limpios.

---
## 22. Módulo de Suscripción

No hay diseño de Stitch para este módulo: usa los tokens MD3 del panel y el patrón de §19/§20. Muestra las suscripciones disponibles, el plan contratado y el historial de pagos asociado a cada suscripción.

### Planes

El catálogo lo envía la API de Laravel en `GET /billing/subscription` (o `GET /billing/plans`). Hoy son dos, definidos también en `data/subscription-data.ts` para el modo demo:

- `novus-mensual` — **NovusPOS Mensual**, $4.99 USD / mes, primer mes gratis.
- `novus-anual` — **NovusPOS Anual**, $59.99 USD / año, un solo pago al año sin mensualidades.

No se afirma ahorro: doce mensualidades cuestan menos que el plan anual. **Solo se puede cambiar de plan cuando la suscripción actual está vencida** (`expired`, `cancelled` o `active` con `renewsAt` pasado). Con una suscripción activa o en revisión, el catálogo explica la fecha de vencimiento y muestra *Disponible al vencer* deshabilitado; el botón *Pagar suscripción* del plan actual sigue disponible para renovar. La regla vive en `lib/subscriptionStatus.ts` y también la aplica el adaptador demo; **Laravel debe enforzarla en el backend**. Cuando sí se permite, el modal usa el precio del plan elegido (no el de la suscripción vigente) y envía `planId` en `POST /billing/payments`. Al aprobar, cambian el plan, el monto y `renewsAt` según `interval` (un mes o un año); la clave del panel se renueva con ese pago.

Al elegir pago móvil o transferencia se consulta la **tasa BCV real del día** y se muestra el total en bolívares junto al monto en dólares: `monto USD × tasa`. El servicio vive en `shared/services/exchange-rate/` con puerto, adaptadores (API pública del BCV, Laravel opcional y respaldo), factory, fachada con caché de 24 h y hook `useExchangeRate`. Por defecto se llama a `https://ve.dolarapi.com/v1/dolares/oficial` (fuente BCV, sin autenticación, CORS `*`, mismo adaptador que usa el escritorio): se toma `promedio` y la fecha de `fechaActualizacion`. Si falla, se usa la tasa guardada en `novuspos:exchange-rate` y, como último recurso, una tasa de referencia marcada con `fallback: true`; la UI lo avisa con *Tasa de referencia* en lugar de *Tasa BCV del día*. Definir `VITE_EXCHANGE_RATE_API_URL=/billing/exchange-rate` (ruta relativa a `VITE_API_URL`) cambia la fuente al endpoint de Laravel cuando ya esté publicado.

### Estructura

```
features/subscription/
├── types.ts                         # Plan, Subscription, PaymentRecord (planId), PaymentDraft
├── data/subscription-data.ts        # plans (mensual y anual), demoSubscription, demoPayments, cuentas y bancos
├── lib/
│   ├── formatters.ts                # formatMoney / formatDate
│   ├── paymentValidation.ts         # reglas puras del pago
│   ├── paymentPresentation.ts       # plan del pago, mes, filtros y totales
│   ├── paymentDraftStore.ts         # caché local del borrador por suscripción
│   ├── paymentFormErrors.ts         # ValidationError → errores por campo
│   ├── subscriptionStatus.ts        # solo permite cambiar de plan si está vencido
│   └── proofImage.ts                # valida y comprime el comprobante
├── services/                        # puerto + demo/HTTP + factory + fachada
├── hooks/                           # useSubscriptionOverview, usePaymentDraft, usePaymentSubmission
└── components/
    ├── SubscriptionOverview.tsx     # contenedor: coordina plan elegido y modal
    ├── PlanCatalog.tsx              # planes disponibles, actual marcado y "Elegir este plan"
    ├── SubscriptionCard.tsx         # plan contratado, estado, anualidad/mensualidad y vigencia
    ├── PaymentHistoryTable.tsx      # tabla con resumen, filtros y búsqueda
    ├── PaymentFilterBar.tsx         # chips de estado + búsqueda
    ├── PaymentRateCard.tsx          # tasa BCV del día y total en bolívares
    ├── PaySubscriptionModal.tsx     # modal de 3 pasos con planId y periodicidad
    ├── PaymentSteps.tsx / PaymentMethodSelector.tsx / PaymentAccountCard.tsx / PaymentSummary.tsx / ProofUpload.tsx
```

El historial muestra **Suscripción** (nombre resuelto desde `payment.planId`, con `subscriptionId` como respaldo), **Mes pagado** (derivable de `paidAt`), referencia, fecha, método, banco, monto, estado y comprobante. No hay tarjeta de indicadores (pagos aprobados, total pagado ni último mes): solo la tabla con filtros y búsqueda locales.

### Contrato

En `BILLING_ENDPOINTS`: `GET /billing/subscription` (con `plans`, `subscription` y `payments`; si faltan, completa con `GET /billing/plans` y `GET /billing/payments`), `POST /billing/payments` con `{ subscriptionId, planId, method, reference, paidAt, bank, proofName, proofDataUrl }` y `PATCH /billing/payments/{id}/review`. En `EXCHANGE_RATE_ENDPOINTS`: `GET /billing/exchange-rate` → `{ rate, currency: 'USD', date, source?: 'BCV' }` (acepta también `rate_data`, `data`, `value` o `tasa`) solo si se define `VITE_EXCHANGE_RATE_API_URL`; sin esa variable se usa la API pública del BCV. La recarga posterior al pago no desmonta el modal. RBAC y la regla de vencimiento los decide el backend, no la UI.

> Verificado con CDP: suscripción activa bloquea el cambio (*Disponible al vencer* deshabilitado) y la vencida permite elegir el anual. La tasa real del día se consultó en línea (25/11/2026: 922,56 → `4.99 × 922.56 = Bs 4.603,59`), se guardó en caché y, al bloquear la API, apareció *Tasa de referencia* con el aviso de respaldo. Con `VITE_EXCHANGE_RATE_API_URL=/billing/exchange-rate` el mock de Laravel entregó 130,50 → `Bs 651,20`. `npm run build` y `npm run lint` limpios.

## 23. Copias de Seguridad: una sola copia vigente

El portal **no crea ni gestiona un historial**: solo muestra la copia más reciente que envía NovusPOS Desktop. Se eliminaron el listado, la verificación, la descarga, el alta manual, los indicadores de espacio y sus datos falsos.

### Estructura

```
features/backups/
├── types.ts                      # BackupSnapshot, BackupUploadRequest
├── data/backup-data.ts           # copia demo con fecha relativa
├── lib/backupFormatters.ts       # fecha larga y día relativo
├── services/
│   ├── backupGateway.ts          # puerto: getLatest / upload (reemplaza la anterior)
│   ├── demoBackupGateway.ts      # demo sin red, un objeto en novuspos:demo-latest-backup
│   ├── httpBackupGateway.ts      # endpoints reales
│   ├── backupGatewayFactory.ts   # elige según VITE_AUTH_MODE
│   └── backupService.ts          # fachada
├── hooks/useLatestBackup.ts      # carga + Actualizar
└── components/
    ├── BackupOverview.tsx        # encabezado + tarjeta + nota
    └── BackupCard.tsx            # tarjeta tipo disco duro
```

### Contrato

En `BACKUP_ENDPOINTS`: `GET /backups/latest` → copia vigente o `null`; `POST /backups` → **upsert** multipart con `database`, `created_at`, `sha256` y `source`, compatible con lo que ya envía el escritorio. Los campos técnicos no aparecen en la UI. El servidor guarda siempre una sola copia por cuenta.

Copy de la tarjeta: fecha legible de la última copia, *Lista en tu cuenta* y la explicación de que, al volver a instalar NovusPOS y entrar con la cuenta, los datos quedan como si no hubiera pasado nada.

> Verificado con CDP en demo y `api` (mock): tarjeta única visible, sin contador de copias, espacio usado, alta ni estado general; sin errores de consola. El log del mock confirmó `GET /backups/latest`.

## 24. Panel general conectado a la API

La portada `/panel` ya no es la maqueta estática ni muestra los KPIs ni los módulos de pago/respaldos. Usa un solo endpoint y componentes presentacionales.

### Contrato

`PANEL_ENDPOINTS.overview` → `GET /panel/overview`:

```ts
{
  organizationName, planName, subscriptionStatus, dueAt,
  activationKey, activationKeyRenewsAt, lastBackupAt
}
```

- **Clave completa y copiable**: la API la envía y se renueva con cada pago; el front nunca la genera ni la enmascara. En demo se deriva del pago aprobado guardado en `novuspos:demo-billing`; si el plan es anual, el resumen muestra *NovusPOS Anual* y la vigencia de un año.
- **Estado efectivo**: lo decide la API (`active`, `pending_review`, `inactive`, `cancelled`). Etiquetas: *Activa*, *Pago en revisión*, *Inactiva · pendiente de pago*, *Cancelada*. En demo, `active` con `dueAt` vencido pasa a `inactive`.
- **Último respaldo**: solo la fecha legible; el detalle está en `/panel/respaldos`.

### Estructura

```
features/dashboard/
├── types.ts / data/dashboard-data.ts / lib/dashboardFormatters.ts
├── services/                     # puerto + demo/HTTP + factory + fachada
├── hooks/useDashboard.ts         # una sola carga
└── components/
    ├── DashboardSection.tsx      # loader, error y composición
    ├── DashboardBanner.tsx       # bienvenida y accesos
    ├── AccessCard.tsx            # plan + estado + clave + copiar
    └── LastBackupCard.tsx        # fecha del último respaldo
```

Se eliminaron `DashboardStats.tsx`, `LicenseCard.tsx` e `InstallerCard.tsx`, y los endpoints `license` y `release-device`: no hay KPIs, asignación de equipo ni botón de cambio. La tarjeta del instalador se retiró porque el banner ya tiene un único CTA de descarga: dos botones se veían redundantes. El menú lateral tampoco muestra *Cajas Registradoras* ni etiquetas de equipo.

> Verificado con CDP en demo y `api` (mock): clave completa, estado activo, plan anual tras la aprobación, fecha de respaldo, sin pagos ni equipo asignado; un solo botón de descarga y sin tarjeta de instalador; sin errores de consola. El mock confirmó `GET /panel/overview`.

## 25. Soporte Técnico

Cuarta ruta del panel: `/panel/soporte`. Formulario validado que se envía a la API con alerta de éxito. No incluye listado de tickets.

### Estructura

```
features/support/
├── types.ts                      # SupportDraft, SupportSubmitRequest, SupportTicket
├── data/support-data.ts          # temas, consejos y borrador vacío
├── lib/supportValidation.ts      # correo, tema, asunto (5–80) y detalle (20–1000)
├── lib/supportFormErrors.ts      # 422 y errores de red → campos
├── services/                     # puerto + demo/HTTP + factory + fachada
├── hooks/useSupportForm.ts       # contenedor: validar, enviar, confirmar
└── components/
    ├── SupportOverview.tsx       # compone formulario o confirmación
    ├── SupportForm.tsx           # campos reutilizables de shared/ui/FormFields
    ├── SupportSuccess.tsx        # alerta con número de reporte
    └── SupportTips.tsx           # ayuda para escribir un buen reporte
```

`TextAreaField` se agregó a `shared/ui/FormFields.tsx` con el mismo icono, foco y error que el login. El correo se precarga de la sesión; el tema es un `SelectField`. En `api` se envía `{ email, topic, subject, description, source: 'web' }` a `POST /support/tickets`; la respuesta `{ id, reference, message }` alimenta la confirmación. En demo responde sin red con referencia `TK-…`.

> Verificado con CDP en demo y `api` (mock): validación por campo, envío y alerta «¡Reporte enviado!» con número de reporte; sin errores de consola. `npm run build` y `npm run lint` limpios.

## 26. Panel maestro del dueño de NovusPOS

Panel separado del portal de clientes, con acceso propio y ruta configurable. Es la consola operativa del dueño: pagos, usuarios, reportes, notificaciones, correos y ajustes de seguridad.

### Acceso y rutas

- Ruta de login configurable desde **Ajustes → Enlace de acceso maestro**; por defecto `/acceso-maestro`. Se guarda en `novuspos:admin-settings` y `getAdminLoginPath()` la usa desde el `routeResolver`, así que cambiar el ajuste cambia la URL real de entrada.
- Login propio en `AdminLoginPage` con `novuspos:admin-session` independiente de `sessionStore`. `AdminGate` redirige a la ruta configurada si no hay sesión maestra; nunca usa el `AuthContext` del cliente.
- Rutas fijas: `/administracion` (resumen), `/pagos`, `/usuarios`, `/reportes`, `/notificaciones`, `/correos` y `/ajustes`, todas bajo `/administracion`.

### Arquitectura

```
src/features/admin/
├── types.ts                       # AdminUser, AdminPayment, AdminReport, AdminNotification, AdminEmail, AdminSettings
├── data/admin-data.ts             # datos demo (8 usuarios, 6 pagos, reportes, avisos) y comprobante SVG
├── lib/
│   ├── adminSession.ts            # sesión aislada del dueño
│   ├── adminSettings.ts           # datos de empresa + ruta de login, normalización y lectura segura
│   └── adminFormatters.ts         # montos USD, fechas y etiquetas
├── services/
│   ├── adminGateway.ts            # puerto único (login, overview, pagos, usuarios, reportes, avisos, correos, ajustes)
│   ├── demoAdminGateway.ts        # demo sin red, persiste cada colección en localStorage
│   ├── httpAdminGateway.ts        # endpoints reales con token Bearer maestro
│   ├── adminGatewayFactory.ts     # VITE_AUTH_MODE
│   └── adminService.ts            # fachada
├── hooks/                         # useAdminSession, useAdminOverview, useAdminPayments, useAdminUsers,
│                                   # useAdminReports, useAdminNotifications, useAdminEmails, useAdminSettings
└── components/
    ├── AdminGate.tsx / AdminLoginPage.tsx / AdminLayout.tsx / AdminSidebar.tsx
    ├── AdminOverview.tsx           # banner ejecutivo, KPIs, dona SVG, actividad y atención
    ├── PlanDonut.tsx / PlanDonutLegend.tsx
    ├── PaymentsPage.tsx / PaymentReviewModal.tsx       # tabla paginada, sin filtro por usuario
    ├── UsersPage.tsx / UserEditModal.tsx
    ├── NotificationsPage.tsx / NotificationHistory.tsx  # formulario + historial paginado
    ├── EmailsPage.tsx / EmailComposer.tsx / EmailEditor.tsx / EmailPreview.tsx / EmailHistory.tsx  # compose + historial
    ├── ReportsPage.tsx / SettingsPage.tsx
    └── ui/AdminUi.tsx              # AdminPageHeader, AdminCard, AdminBadge, AdminAvatar, AdminModal…
```

### Diseño profesional (pedido explícito)

Se mantiene MD3 (azul `#003ec7`, superficies claras, Plus Jakarta Sans y JetBrains Mono) con dos tokens nuevos en `index.css`: `--color-admin-ink` (`#0a1734`) y `--color-admin-ink-soft` (`#13295e`), usados solo en la navegación y el acceso maestro. Las clases repetidas viven en `lib/adminStyles.ts` (tarjetas, botones, inputs, celdas, avatares); no se inventan CSS ni CDN.

- **Sidebar:** navegación agrupada en Operación / Comunicación / Sistema, acento verde en el item activo, logo local `novuspos-icon.png`, tarjeta con la ruta privada vigente y cierre de sesión. En móvil se convierte en cajón con backdrop.
- **Cabecera:** ruta contextual, fecha, avatar con iniciales y rol «Super administrador».
- **Resumen:** banner con gradiente azul profundo y acciones rápidas, cuatro KPIs con acento semántico, gráfica de dona calculada con los planes reales, pagos recientes con avatar/estado y tarjeta «Requiere tu atención».
- **Módulos:** tablas con encabezados suaves, filas con hover, badges por estado y botones secundarios; las gráficas y los totales siempre salen de los datos del gateway (nada de métricas inventadas). Notificaciones y correos muestran vista previa en vivo y ambos historiales son paginados; pagos tienen tabla paginada (20/50/100), chips de estado, búsqueda con debounce y nota de revisión, sin selector de usuario; usuarios y reportes tienen tarjetas de conteo y filtros consistentes.
- **Acceso:** pantalla dividida con marca e iconos de confianza a la izquierda y el formulario a la derecha; en móvil queda solo el formulario.

Se repite el patrón del resto del front: puerto + adaptadores demo/API + factory + fachada + hooks contenedores + componentes presentacionales. Ningún componente supera 300 líneas.

### Funcionalidad

- **Resumen:** usuarios registrados, usuarios sin suscripción al día, pagos por validar, reportes abiertos, ingresos aprobados en USD, gráfica de suscripción más vendida y pagos recientes.
- **Pagos:** filtros por usuario y estado (por aprobar / aprobados / rechazados / todos). El modal de evaluación muestra el comprobante, referencia, banco, monto y plan; el dueño aprueba o rechaza manualmente tras consultar su banco. Aprobar activa la suscripción del usuario y aplica el plan del pago.
- **Usuarios:** búsqueda, paginación de 5, edición de datos, asignación de plan mensual/anual y activación o desactivación de la suscripción.
- **Reportes:** tabla de reportes del portal y del escritorio, filtros por origen y estado, detalle del mensaje.
- **Notificaciones y correos:** formularios personalizables con título/asunto, descripción/cuerpo, enlace o icono, tipo y destinatario (todos o un usuario). El compose de correos usa `EmailComposer`, `EmailEditor` y `EmailPreview`: campo *Para*, asunto y mensaje enriquecido con títulos, negrita, cursiva, subrayado, listas, enlaces e imágenes por URL, además de una plantilla opcional. `lib/emailHtml.ts` sanea el HTML antes de enviarlo o mostrarlo (sin scripts, eventos ni estilos peligrosos) y genera texto plano para el historial; `POST /admin/emails` recibe `{ subject, body, bodyText, audience, audienceLabel }`, donde `body` es HTML saneado y `bodyText` el texto plano. Ambos historiales tienen búsqueda (300 ms de debounce), filtro por destinatario, selector de 20/50/100 registros por página y paginación anterior/siguiente; el de notificaciones también filtra por tipo. El gateway filtra y corta en servidor, así que la UI solo renderiza la página actual (ni miles de filas en memoria ni miles de nodos en el DOM). Laravel debe aplicar el mismo corte en SQL con `ORDER BY created_at DESC`.
- **Ajustes:** datos de la empresa (nombre, correo, teléfono, dirección) y ruta secreta del login, con validación de path.

### Contrato

`ADMIN_ENDPOINTS` en `shared/services/endpoints.ts`: `POST /admin/login`, `GET /admin/overview`, `GET /admin/payments`, `PATCH /admin/payments/{id}/review`, `GET /admin/users`, `PATCH /admin/users/{id}`, `PATCH /admin/users/{id}/subscription`, `GET /admin/reports`, `GET/POST /admin/notifications`, `GET/POST /admin/emails` y `GET/PUT /admin/settings`. El GET de notificaciones usa `notificationHistory({ page, pageSize, search, type, audience })` → `/admin/notifications?page=1&pageSize=20&search=&type=&audience=` y responde `{ items, total, page, pageSize }`; los parámetros vacíos se omiten. `audience=''` = todos los destinatarios y `audience='all'` = solo avisos globales. El GET de correos usa `emailHistory({ page, pageSize, search, audience })` → `/admin/emails?page=1&pageSize=20&search=&audience=` y responde `{ items, total, page, pageSize }`; aquí `audience=''` = todos los destinatarios y `audience='all'` = solo correos a todos. El POST de correos envía `{ subject, body, bodyText, audience, audienceLabel }`; Laravel debe sanear el HTML otra vez antes de despacharlo y guardar `bodyText` para búsqueda/historial. El GET de pagos usa `paymentHistory({ page, pageSize, search, status })` → `/admin/payments?page=1&pageSize=20&search=&status=` y responde `{ items, total, page, pageSize, summary }`, donde `summary` (`pending`, `approved`, `rejected`, `total`) son conteos globales para las tarjetas aunque la tabla esté filtrada; no hay parámetro de usuario. Laravel debe filtrar, ordenar por `created_at DESC` y cortar en SQL, y calcular `summary` sobre toda la tabla. Los adaptadores HTTP envían el token maestro por cabecera `Authorization`, separado del token del cliente.

> Verificado con CDP en demo tras el rediseño: login maestro con branding, resumen con dona y tarjeta de atención, búsqueda y aprobación de pago con nota, búsqueda/paginación de usuarios, vistas previas de notificación y correo, reportes del escritorio, guardado de la ruta personalizada y redirección del guardián a esa ruta; sin errores de consola. Historial de notificaciones verificado con 137 registros sembrados: paginación 20/50/100, anterior/siguiente, filtros por tipo y destinatario, búsqueda con debounce y actualización del total al publicar; 20/50/100 filas renderizadas por página, sin errores de consola. Historial de correos verificado con 137 registros sembrados: paginación 20/50/100, anterior/siguiente, filtro por destinatario, búsqueda con debounce y actualización del total al enviar; 20/50/100 filas renderizadas por página, sin errores de consola. Compose enriquecido verificado con CDP: plantilla, título, enlace sobre texto seleccionado e imagen por URL en editor y vista previa; saneamiento de `onerror`/`<script>`, guardado de `body` HTML y `bodyText` plano, historial legible y sin errores de consola. Pagos verificados con 137 registros sembrados: sin filtro por usuario, 20/50/100 filas por página (7/3/2 páginas), anterior/siguiente, chips de estado, búsqueda con debounce, tarjetas globales y actualización al aprobar; sin errores de consola. `npm run build` y `npm run lint` limpios.
