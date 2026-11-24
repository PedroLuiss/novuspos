---
name: novuspos-web-landing
description: GuÃ­a de arquitectura y diseÃ±o para la landing page oficial de NovusPOS (novuspos-front: React 19 + Vite + Tailwind v4). Ãšsala SIEMPRE que se modifique el sitio web, se componenticen vistas desde Stitch o se agreguen secciones al marketing.
---

# Skill: NovusPOS Web â€” Landing Page Oficial

Complementa a `novuspos-guide`. Aplica al repositorio **`novuspos-front/`** (sitio de marketing), distinto del shell Electron de `novus-post/`.

> ðŸ›‘ **Regla de oro:** la landing es una **rÃ©plica exacta** del diseÃ±o de Stitch **"NovusPOS - Landing Page Oficial"**. Textos, colores, iconos, clases y orden de secciones deben coincidir con el HTML de Stitch. **No improvises ni rediseÃ±es.**
>
> âš ï¸ **ExcepciÃ³n actual (pedido explÃ­cito):** el hero ya no usa el mockup HTML de Stitch. Muestra capturas reales del sistema en un carrusel apilado con el efecto de `nexusposgobal.com`. Ver Â§9.
>
> âš ï¸ **ExcepciÃ³n 2 (veracidad del copy):** `KeyFeatures` y `KeyboardCheatSheet` fueron auditados contra `novus-post/docs/context/`; donde Stitch afirmaba algo falso sobre el sistema, prevalece la documentaciÃ³n real. Ver Â§10.
>
> âš ï¸ **ExcepciÃ³n 3 (tabla y FAQ):** `ComparisonTable` y `HardwareFaq` tambiÃ©n se auditaron; se eliminaron las mÃ©tricas inventadas y el claim de impresiÃ³n ESC/POS. Ver Â§11.
>
> âš ï¸ **ExcepciÃ³n 4 (precios):** `Pricing` conserva el precio comercial, pero su checklist tÃ©cnico y la lÃ­nea de Windows se auditaron; se eliminaron ESC/POS, backups automÃ¡ticos y soporte por WhatsApp. Ver Â§12.
>
> âš ï¸ **ExcepciÃ³n 5 (hero y footer):** `HeroHeader` y `Footer` tambiÃ©n se auditaron; se eliminaron "100% sin internet", ESC/POS, la latencia en milisegundos y "ultra-alto rendimiento". Ver Â§13.
>
> âš ï¸ **ExcepciÃ³n 6 (tono comercial positivo):** todo el copy se reescribiÃ³ para que hable de beneficios comprensibles para quien va a usar el sistema. No reintroducir detalles internos (SQLite, WAL, transacciones, `append-only`, `soft delete`, `SHA-256`, RS-232, COM/baudios) ni frases restrictivas ("pendiente de validaciÃ³n", "aÃºn no integrados", "no hay cifras oficiales"). Ver Â§14.
>
> âš ï¸ **ExcepciÃ³n 7 (secciÃ³n de productos):** se aÃ±adiÃ³ `ProductCatalog` (`#productos`) entre `KeyFeatures` y la comparativa. No estÃ¡ en el HTML de Stitch; sale del mÃ³dulo real `inventory` de `novus-post`. Ver Â§15.
>
> âš ï¸ **ExcepciÃ³n 8 (vistas de auth):** se replicÃ³ la pantalla de Stitch "Iniciar SesiÃ³n / Registro - NovusPOS" como `/auth` y `/auth/login`. Layout idÃ©ntico; copy auditado con las reglas Â§14/Â§14.2. Ver Â§16.
>
> âš ï¸ **ExcepciÃ³n 9 (panel de control):** se replicÃ³ "Panel de Control de Clientes - NovusPOS" como `/panel`. Layout idÃ©ntico (sidebar 64 + header + bento grid), copy auditado. Ver Â§17.

---

## 1. Fuente de verdad: Stitch

Proyecto: `projects/14269822984035378146` â€” **"NovusPOS Landing and Admin Portal"**.
Pantalla: `screens/82fef7e6f4a148cabdc44a42ef4d5ac6` â€” **"NovusPOS - Landing Page Oficial"** (DESKTOP 2560Ã—10642).
- HTML: `files/10532653372921472128` Â· Screenshot: `files/14233028886615310537`.

**Flujo:**
1. `tools.stitch.list_projects({ pageSize: 100 })` â†’ localizar el proyecto.
2. `tools.stitch.get_project({ name })` â†’ tema, tipografÃ­a, screens.
3. `tools.stitch.list_screens({ projectId })` â†’ `htmlCode.name` y `screenshot.name`.
4. `tools.stitch.download_file({ name })` â†’ HTML (contiene el `tailwind.config` con TODOS los tokens) y screenshot.

> âš ï¸ **El screenshot de Stitch NO sirve como referencia tipogrÃ¡fica.** Su renderizador no cargÃ³ Google Fonts: **todo el texto sale en Times New Roman** (verificado ampliando el bitmap). Por eso los saltos de lÃ­nea y algunas alturas del screenshot no coinciden con el diseÃ±o real. La verdad son el **HTML + `tailwind.config`**.

---

## 2. Stack

| Capa | TecnologÃ­a |
| :--- | :--- |
| Build | Vite 8 + `@vitejs/plugin-react` |
| UI | React 19 + TypeScript |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Iconos | **Material Symbols Outlined** (fuente local) |
| TipografÃ­a | Plus Jakarta Sans + JetBrains Mono (**autoalojadas**) |
| Alias | `@/*` â†’ `src/*` |

### Assets autoalojados (cero dependencias de red)

| Archivo | Uso |
| :--- | :--- |
| `public/fonts/*.woff2` + `public/fonts/fonts.css` | Plus Jakarta Sans (200-800) y JetBrains Mono (100-800), subsets latin/latin-ext |
| `public/MaterialSymbolsOutlined.ttf` | Iconos (`.material-symbols-outlined`) |
| `public/novuspos-logo.png` | Logo del header y footer |
| `public/imagen/*.png` | Capturas del sistema para el carrusel del hero (`novusposventa.png`) |

> âŒ No enlaces a `fonts.googleapis.com` ni a `lh3.googleusercontent.com`: si falla la red el diseÃ±o se degrada (y los assets de Stitch caducan).

---

## 3. ðŸš¨ Tailwind v4: regla crÃ­tica de tokens

**NUNCA escribas utilidades a mano en `@layer utilities`.** Tailwind v4 las genera desde `@theme` usando *namespaces*. Si usas el namespace equivocado, la clase **no existe y falla en silencio**.

| Namespace | Genera | Ejemplo |
| :--- | :--- | :--- |
| `--color-*` | `bg-*`, `text-*`, `ring-*`, `divide-*`, `from-*` **+ modificadores `/40`** | `--color-surface: #f7f9fb` â†’ `bg-surface`, `bg-surface/50` |
| `--text-*` | `text-*` (tamaÃ±o + `--line-height` + `--font-weight`) | `--text-body-md: 14px` â†’ `text-body-md` |
| `--font-*` | `font-*` (familia) | `--font-display: "Plus Jakarta Sans"` â†’ `font-display` |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, `space-y-*` | `--spacing-space-xl: 2.5rem` â†’ `p-space-xl`, `gap-space-xl` |
| `--radius-*` | `rounded-*` | `--radius-xl: 0.75rem` |

```css
/* âœ… Correcto */
@theme {
  --spacing-space-lg: 1.5rem;   /* â†’ p-space-lg, px-space-lg, gap-space-lg, md:p-space-lg */
  --text-headline-lg: 36px;
  --text-headline-lg--line-height: 44px;
  --text-headline-lg--font-weight: 700;
}

/* âŒ Incorrecto: `--space-lg` no genera ninguna utilidad */
@theme { --space-lg: 1.5rem; }
```

**SÃ­ntoma tÃ­pico de este bug:** las tarjetas se ven "pegadas" al borde, sin padding, y la pÃ¡gina queda ~25 % mÃ¡s corta que Stitch. PasÃ³ exactamente eso (4172px vs 5350px); al corregir los namespaces quedÃ³ en 5292px.

**Segundo bug de Tailwind v4: escaneo de HTML de referencia.** Por defecto Tailwind escanea todos los archivos del proyecto, incluidos `public/imagen/module_*.html`, y genera utilidades huÃ©rfanas: el CSS pasÃ³ de 34.5 kB a 65 kB al agregar esos archivos. `src/index.css` excluye esa carpeta con `@source not "../public/imagen/*.html";`. No quitar esa lÃ­nea; las clases de la landing se generan igual desde `src/`.

**AuditorÃ­a rÃ¡pida** de clases usadas vs. generadas:
```bash
node -e "const c=require('fs').readFileSync('dist/assets/'+require('fs').readdirSync('dist/assets').find(f=>f.endsWith('.css')),'utf8');['.p-space-lg{','.px-margin{','.gap-space-md{'].forEach(s=>console.log(s,c.includes(s)?'OK':'MISSING'))"
```

---

## 4. Estructura (FSD adaptada)

```text
src/
â”œâ”€â”€ App.tsx                             # rutas: /auth | /auth/login â†’ AuthPage; /panel â†’ PanelPage
â”œâ”€â”€ app/LandingPage.tsx                 # SiteHeader + <main class="pt-20"> + secciones + Footer
â”œâ”€â”€ app/AuthPage.tsx                    # split 5/7 + barra inferior de confianza
â”œâ”€â”€ app/PanelPage.tsx                   # sidebar + header + portada o uno de los tres mÃ³dulos
â”œâ”€â”€ features/panel/                     # PanelSidebar + data/ (navegaciÃ³n del panel)
â”œâ”€â”€ features/dashboard/                 # Portada: clave, suscripciÃ³n y Ãºltimo respaldo
â”œâ”€â”€ features/subscription/              # Planes, pagos e historial
â”œâ”€â”€ features/backups/                   # Ãšnica copia vigente de la cuenta
â”œâ”€â”€ features/support/                   # Formulario de reportes de soporte
â”œâ”€â”€ shared/ui/MS.tsx                    # icono Material Symbols (filled opcional)
â”œâ”€â”€ shared/ui/FormFields.tsx            # FieldShell / TextField / PasswordField / SelectField reutilizables
â”œâ”€â”€ features/auth/
â”‚   â”œâ”€â”€ components/AuthBrandPanel.tsx   # columna izquierda (logo blanco, mÃ©tricas, beneficios)
â”‚   â”œâ”€â”€ components/AuthFormPanel.tsx    # columna derecha (tabs, formularios, accesos)
â”‚   â”œâ”€â”€ components/AuthFields.tsx       # re-export de shared/ui/FormFields (compatibilidad)
â”‚   â”œâ”€â”€ components/RegisterForm.tsx     # registro con licencia de prueba
â”‚   â”œâ”€â”€ components/LoginForm.tsx        # inicio de sesiÃ³n con perfil
â”‚   â””â”€â”€ data/auth-data.ts              # beneficios, sectores, perfiles y confianza
â”œâ”€â”€ features/landing/
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ SiteHeader.tsx              # header fixed h-20
â”‚   â”‚   â”œâ”€â”€ HeroHeader.tsx              # MS + HighlightPill + cabecera del hero
â”‚   â”‚   â”œâ”€â”€ HeroMockup.tsx              # wrapper del carrusel (antes: mockup HTML del POS)
â”‚   â”‚   â”œâ”€â”€ ScreenshotCarousel.tsx      # carrusel 3D apilado, relevo suave estilo NexusPOS
â”‚   â”‚   â”œâ”€â”€ product/ProductCard.tsx     # ProductCard + CartRow (sin uso tras el carrusel)
â”‚   â”‚   â”œâ”€â”€ Kbd.tsx                     # atajo inline <strong class="font-mono">
â”‚   â”‚   â”œâ”€â”€ Hero.tsx                    # glow + HeroHeader + HeroMockup
â”‚   â”‚   â”œâ”€â”€ KeyFeatures.tsx             # 6 tarjetas (#caracteristicas)
â”‚   â”‚   â”œâ”€â”€ ProductCatalog.tsx          # 4 grupos + 6 datos de ficha (#productos)
â”‚   â”‚   â”œâ”€â”€ KeyboardCheatSheet.tsx      # F1-F5, F12, ALT+Q
â”‚   â”‚   â”œâ”€â”€ ComparisonTable.tsx         # Desktop vs POS nube
â”‚   â”‚   â”œâ”€â”€ Pricing.tsx                 # plan Ãºnico $4.99 (#precios)
â”‚   â”‚   â”œâ”€â”€ HardwareFaq.tsx             # 3 FAQs
â”‚   â”‚   â”œâ”€â”€ FinalCta.tsx                # CTA gradiente (#descargar)
â”‚   â”‚   â””â”€â”€ Footer.tsx                  # 3 columnas + lÃ­nea legal
â”‚   â””â”€â”€ data/landing-data.tsx           # contenido tipado (JSX para negritas/mono inline)
â””â”€â”€ index.css                           # @font-face + @theme (tokens) + shimmer
```

Reglas: componentes â‰¤ 300 lÃ­neas, hooks â‰¤ 200, contenido en `data/`, `aria-hidden` en iconos decorativos, mobile-first.

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

TipografÃ­a: display 48/56 (800), headline-lg 36/44 (700), headline-md 24/32 (700), headline-sm 20/28 (600), body-lg 16/24, body-md 14/20, body-sm 12/16, label-md 13/18 (600), label-sm 11/14 (500, JetBrains Mono), numeric-total 32/38 (700), numeric-keypad 20/26 (600).

Espaciado: `space-xl` 2.5rem Â· `space-lg` 1.5rem Â· `space-md` 1rem Â· `space-sm` .5rem Â· `space-xs` .25rem Â· `margin` 1.5rem.

---

## 6. Orden de secciones

1. `SiteHeader` (fixed, h-20) â†’ `<main class="pt-20">`
2. `Hero` â€” glow; **grid de 2 columnas en desktop**: izquierda = pÃ­ldora "âš¡ TRABAJA SIN DEPENDER DE INTERNET" (sin nÃºmero de versiÃ³n), headline, "Lema oficial", subtÃ­tulo, CTAs y 4 trust badges (alineados a la izquierda); derecha = carrusel de capturas (#interfaz-en-vivo), movido de abajo hacia arriba. En mÃ³vil se apila (texto arriba, capturas abajo).
3. `KeyFeatures` (`#caracteristicas`) â€” 6 tarjetas con copy verificado contra los contextos 02â€“06 y 08 (ver Â§10).
4. `ProductCatalog` (`#productos`) â€” 4 grupos de productos + 6 datos de ficha (ver Â§15). Enlace "Productos" en el header.
5. `KeyboardCheatSheet` â€” 7 atajos reales (`ALT+1`â€¦`ALT+7`, `F12`, `ALT+Q`). Actualmente comentado en `LandingPage.tsx`.
6. `ComparisonTable` â€” 5 filas con copy verificado contra contextos 01, 02, 05 y 08 (ver Â§11).
7. `Pricing` (`#precios`) â€” plan Ãºnico $4.99; checklist verificado (ver Â§12).
8. `HardwareFaq` â€” 3 preguntas; perifÃ©ricos y requisitos corregidos segÃºn docs (ver Â§11).
9. `FinalCta` (`#descargar`)
10. `Footer`

---

## 7. Checklist al modificar

- [ ] Â¿Extraje textos/clases del HTML de Stitch con `download_file`?
- [ ] Â¿Los tokens nuevos usan el namespace correcto de Tailwind v4?
- [ ] Â¿Los assets nuevos son locales (no CDN)?
- [ ] Â¿UsÃ© `MS` para iconos y `Kbd` para atajos inline?
- [ ] Â¿Se mantienen ids de ancla y orden de secciones?
- [ ] Â¿El copy de caracterÃ­sticas/atajos coincide con `novus-post/docs/context/` (no con Stitch cuando contradiga al sistema)?
- [ ] `npm run build` + `npm run lint` limpios.
- [ ] Â¿ActualicÃ© `novus-post/docs/context/09-LANDING-WEB.md`?

---

## 8. VerificaciÃ³n visual (sin Playwright)

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-sandbox `
  --hide-scrollbars --window-size=1280,7000 --screenshot="captura.png" "http://127.0.0.1:5173/"
```

El viewport de referencia es **1280px** (ahÃ­ `max-w-7xl` = 1280 y el diseÃ±o ocupa todo el ancho). El screenshot oficial mide 1280Ã—5351; la implementaciÃ³n actual ronda los **4780px** de alto (el hero de dos columnas comparte altura entre texto y capturas).

VerificaciÃ³n rÃ¡pida del layout del hero a 1280px: `#interfaz-en-vivo` debe quedar en `xâ‰ˆ660, yâ‰ˆ230, wâ‰ˆ596, hâ‰ˆ477` y el `<h1>` en `xâ‰ˆ24, yâ‰ˆ166, wâ‰ˆ596`.

> El diseÃ±o usa MD3 (azul `#003ec7`/`#0052ff`), **no** el Fluent POS Engine del escritorio. No mezclar sistemas.

---

## 9. Carrusel de capturas del hero (pedido explÃ­cito, excepciÃ³n a Stitch)

`HeroMockup.tsx` ya no contiene el mockup HTML del terminal. Solo renderiza `ScreenshotCarousel`, que muestra las capturas reales de `public/imagen/` apiladas unas debajo de otras, replicando el efecto de **nexusposgobal.com**:

- Cada **4s** cambia de captura (`setInterval` + `setActive((i) => (i + 1) % screenshots.length)`).
- La tarjeta activa: `z-20 opacity-100` + `rotateX(15deg) rotateY(-15deg) rotateZ(5deg) translateZ(0)`.
- La inactiva: `z-10 opacity-30` + `translateZ(-180px) translateY(-90px) translateX(110px)`.
- Ambas con `transition-all duration-1000 ease-in-out`: la de arriba se oculta suavemente y la de abajo pasa al frente.
- Contenedor `[transform-style:preserve-3d] [perspective:1200px]`, `max-w-5xl aspect-[5/4]`; las capturas actuales son 1600Ã—1280 y 1280Ã—1053 y se ajustan con `object-contain`.
- Las dos primeras capturas se cargan con `loading="eager"` para que el relevo de 4s no muestre un hueco; el resto con `lazy`.
- Se respeta `prefers-reduced-motion` (no autodesplaza).

**Capturas actuales (5):** `/imagen/novusposventa.png` (ventas), `/imagen/novuspos_producto.png` (productos), `/imagen/novuspos_kardex.png` (Kardex), `/imagen/novus_caja.png` (caja) y `/imagen/novus_cliente.png` (clientes), en ese orden. El relevo de 4s rota sobre todas. `ScreenshotSlide` admite `fit?: 'contain' | 'cover'`: por defecto `object-contain`, pero `novus_caja.png` (1280Ã—1384, mÃ¡s alta que el contenedor 5:4) usa `fit: 'cover'` â†’ `object-cover object-top` para llenar el recorte sin dejar bandas laterales; se recorta la parte baja, no la cabecera. Si se agrega otra captura alta, usar el mismo `fit: 'cover'`.

**Para agregar mÃ¡s:** coloca el PNG en `public/imagen/` y aÃ±ade una entrada al array `screenshots` en `landing-data.tsx`:

```tsx
export const screenshots: ScreenshotSlide[] = [
  { src: '/imagen/novusposventa.png', alt: 'Terminal de ventas NovusPOS' },
  { src: '/imagen/novuspos_producto.png', alt: 'CatÃ¡logo e inventario' },
  { src: '/imagen/novuspos_kardex.png', alt: 'Kardex y auditorÃ­a' },
  { src: '/imagen/novus_caja.png', alt: 'Caja y corte Z', fit: 'cover' },
  { src: '/imagen/novus_cliente.png', alt: 'Clientes y crÃ©ditos' },
  { src: '/imagen/nueva-captura.png', alt: 'Nueva captura' }, // â† nueva
]
```

El ancla `#interfaz-en-vivo` se conserva en el contenedor del carrusel, ahora ubicado en la **columna derecha del hero** (`HeroHeader` usa `lg:grid-cols-2 items-center gap-space-xl`; en mÃ³vil el carrusel baja con `mt-space-lg`).

---

## 10. Copy verificado contra el sistema (excepciÃ³n 2 a Stitch)

`KeyFeatures.tsx` es solo el renderizador; las 6 tarjetas viven en `features` (`landing-data.tsx`). Ese array y `shortcuts` se auditaron contra `novus-post/docs/context/00-MASTER-CONTEXT.md` y los contextos **02 (POS), 03 (Inventario), 04 (Kardex), 05 (Caja), 06 (Clientes) y 08 (Ajustes/Hardware)**. Donde el HTML de Stitch contradecÃ­a al sistema, prevalece la documentaciÃ³n:

| Antes (Stitch) | Ahora (sistema real) | Fuente |
| :--- | :--- | :--- |
| Atajos `F1-F7` | `ALT+1`â€¦`ALT+7` para navegar; `F2`, `F6`, `F7`, `F8`, `F12`, `ALT+Q`, `ALT+P`, `ALT+E` en POS | 00 Â§5, 02 Â§3 |
| Cobro mixto = "efectivo, tarjeta, crÃ©dito" | Cuatro medios: efectivo, tarjeta, **mixto (`F8`, efectivo+tarjeta)** y crÃ©dito | 02 Â§1, Â§4 |
| "Latencia por escaneo < 0.8ms" | "BÃºsqueda paginada y cobro transaccional SQLite" (sin mÃ©trica inventada) | â€” |
| "Papelera de reciclaje" | Baja lÃ³gica (`deleted=1, active=0`) que preserva Kardex | 03 Â§4.1, 00 Â§3.4 |
| `ALT+E` = "entradas directas" | `ALT+E` = entradas masivas; `ALT+S` = salidas por merma | 03 Â§3 |
| EAN-13/Code128, etiquetas DPI | 7 simbologÃ­as (EAN-13/8, UPC-A, ITF-14, Code128, Code39, OTRO) y mm | 03 Â§1, Â§4.8 |
| "Segundo a segundo", exportaciÃ³n Excel | Fecha/hora exacta, append-only, XLSX y PDF de todos los filtrados | 04 Â§1, Â§5 |
| `Fondo + Ventas + Abonos - Gastos`, "cierre ciego" | `Fondo + Ventas + Abonos + Ingresos manuales - Gastos - Devoluciones en efectivo`; sobrante/faltante en vivo; tarjeta y crÃ©dito excluidos | 05 Â§ "Reglas operativas" |
| "Probada con CAS", "COM1-COM8", "COM/USB" | Torrey, Rhino y Dibal; puerto COM + baudios persistidos; validaciÃ³n fÃ­sica pendiente | 08 Â§1 |
| "compras fadas", recibo de abono impreso | "compras fiadas"; abono a deudas mÃ¡s antiguas con impacto en gaveta (ESC/POS no conectado) | 06 Â§1/Â§6, 08 Â§1 |
| "hasta 500,000 transacciones mensuales" | "alto volumen transaccional" | â€” |

`KeyboardCheatSheet.tsx` tambiÃ©n mostraba `F1`â€“`F5` como navegaciÃ³n; ahora usa `ALT+1`â€¦`ALT+7`, `F12` â†’ "Cobro EstÃ¡ndar" y `ALT+Q`. `KeyCap` aplica `px-2 text-[13px]` cuando la tecla tiene mÃ¡s de 3 caracteres para que `ALT+1` quepa sin desbordar, conservando el color del variante.

> Si en el futuro se vuelve a sincronizar con Stitch, **no restaurar estos textos**: la fidelidad visual se sacrificÃ³ deliberadamente por veracidad funcional en el hero (Â§9), las tarjetas y atajos (Â§10) y la tabla y FAQ (Â§11).

---

## 11. Tabla comparativa y FAQ verificadas (excepciÃ³n 3 a Stitch)

`ComparisonTable.tsx` renderiza `comparisonRows` y `HardwareFaq.tsx` renderiza `faqs`; ambos arrays viven en `landing-data.tsx`. Se auditaron contra los contextos **00, 01, 02, 05 y 08**:

| Antes (Stitch) | Ahora (sistema real) | Fuente |
| :--- | :--- | :--- |
| "âœ“ 100% Ininterrumpido (SQLite Local Nativo)" | "âœ“ NÃºcleo POS offline-first con SQLite local en modo WAL" (bootstrap/OTP, reportes y tasas BCV sÃ­ requieren red) | 00 Â§1/Â§3.7, 01 Â§1/Â§4, 02 Â§4 |
| "~0.5 a 1.2 ms" / "300â€“2500 ms" | "âœ“ BÃºsqueda local paginada en SQLite (50 por pÃ¡gina), sin viaje de red" | 02 Â§1, Â§5.14 |
| "ConexiÃ³n directa a puertos COM nativos" | "âœ“ Lectura serial con puerto COM y baudios configurables (Torrey, Rhino, Dibal)" | 08 Â§1 |
| "âœ“ ESC/POS directo al puerto RAW sin diÃ¡logo de Windows" | "âœ“ PDF vectorial nativo 80mm/58mm/Carta con descarga directa" | 02 Â§1, 08 Â§1/Â§6 |
| FAQ: "cualquier impresora ESC/POS vÃ­a USB/Serial/Red", CAS, BAR-9 | PDF vectorial + diÃ¡logo nativo para etiquetas (no ESC/POS/ZPL); Torrey/Rhino/Dibal por RS-232, validaciÃ³n fÃ­sica pendiente | 08 Â§1/Â§6 |
| FAQ: Windows 10/11, i3, 4 GB RAM, 250 MB, VFD | Electron, Fluent/WinUI 3, SQLite local y ventana mÃ­nima 960Ã—600; sin cifras oficiales de CPU/RAM/disco | 00 Â§1/Â§3.7 |
| FAQ: "escribe de manera atÃ³mica e **instantÃ¡nea** ... si se corta la energÃ­a ningÃºn registro queda a medias" | "se confirma en una transacciÃ³n atÃ³mica y queda persistido en el disco local"; sin garantÃ­a de durabilidad ante corte de luz | 00 Â§1, 02 Â§113 |
| FAQ: "**sin dependencia de un servidor** en la fase monopuesto" | "cobro, inventario y caja operan sin servidor; primer ingreso, OTP, reportes y tasas BCV sÃ­ requieren conexiÃ³n" | 01 Â§1/Â§4, 00 Â§3.7, 02 Â§4 |

La fila de precio ($4.99/mes, primer mes gratis) se conserva: es una decisiÃ³n comercial documentada en `09-LANDING-WEB.md`, no una afirmaciÃ³n tÃ©cnica del sistema.

> Regla futura: todo copy que mencione hardware o rendimiento debe verificarse en `08-SETTINGS-HARDWARE.md` y `02-POS-SALES.md` antes de copiarlo de Stitch.

---

## 12. Pricing verificado (excepciÃ³n 4 a Stitch)

`Pricing.tsx` conserva el precio comercial (`$4.99 USD / mes`, `PRIMER MES $0`, `30 dÃ­as gratis`, sin tarjeta). El nÃºmero de versiÃ³n y el tamaÃ±o del instalador se retiraron del copy (ver Â§14.2). El checklist y la lÃ­nea de Windows sÃ­ se auditaron contra los contextos **00, 01, 02, 04, 05 y 08**:

| Antes (Stitch) | Ahora (sistema real) | Fuente |
| :--- | :--- | :--- |
| "Para Windows 11 / 10 x64" | "Para Windows 10 o Windows 11" (Windows 10 reincorporado en Â§14.1: Electron 39 lo admite) | `novus-post/package.json`, `electron-builder.yml` |
| "SQLite integrada de ultra-alto rendimiento" | "SQLite integrada y operaciÃ³n offline-first" | 00 Â§1 |
| "Productos y transacciones ilimitadas sin ralentizaciÃ³n" | "CatÃ¡logo y transacciones sin costos por volumen ni comisiones" | â€” (claims de precio, no de rendimiento) |
| "Impresoras tÃ©rmicas ESC/POS de 58/80mm y cajÃ³n de dinero" | "BÃ¡sculas RS-232 (Torrey, Rhino, Dibal) y tickets PDF 80/58mm; ESC/POS y gaveta aÃºn no integrados" | 08 Â§1/Â§6, 02 Â§4 |
| "Corte Z, control de caja y Kardex inmutable" | Sin cambios | 04, 05 |
| "Actualizaciones continuas v2.x y soporte prioritario por WhatsApp y Ticket" | "Soporte por ticket desde la app (requiere internet)" | 00 Â§3.7, 08 Â§1 |
| "Copias de seguridad automÃ¡ticas a memorias USB o carpetas compartidas" | "Respaldo verificado con SHA-256 en la carpeta de datos de la app, con restauraciÃ³n y copia preventiva" | 08 Â§1/Â§6 |

> No restaurar estos textos en una futura sincronizaciÃ³n con Stitch: las excepciones deliberadas son hero (Â§9 y Â§13), tarjetas/atajos (Â§10), tabla/FAQ (Â§11), precios (Â§12) y footer (Â§13).

---

## 13. Hero y footer verificados (excepciÃ³n 5 a Stitch)

`HeroHeader.tsx` (ademÃ¡s del carrusel de Â§9) y `Footer.tsx` se auditaron contra los contextos **00, 01, 02, 08 y 09**:

| Antes (Stitch) | Ahora (sistema real) | Fuente |
| :--- | :--- | :--- |
| Badge "Instalador Nativo x64" | "Instalador nativo para Windows" (x64 no documentado) | 00 Â§1 |
| Badge "Sin caÃ­das por internet" | "NÃºcleo offline-first" (bootstrap/OTP, reportes y BCV sÃ­ requieren red) | 00 Â§3.7, 01 Â§1/Â§4, 02 Â§4 |
| H1 "mÃ¡s rÃ¡pido ... sin ataduras a la nube" | "rÃ¡pido, confiable y con nÃºcleo offline-first" (sin superlativo ni absoluto) | â€” |
| "Procesa transacciones en milisegundos ... Opera 100% sin conexiÃ³n" | "Cobro, inventario y caja sobre SQLite local con transacciones atÃ³micas. El nÃºcleo opera sin internet; el primer ingreso, la recuperaciÃ³n OTP, los reportes y las tasas BCV sÃ­ lo requieren" | 00 Â§1, 01 Â§1/Â§4, 02 Â§4 |
| "Imprime tickets tÃ©rmicos ESC/POS de 80mm" | "Tickets PDF 80/58mm" (ESC/POS no integrado) | 08 Â§1/Â§6, 02 Â§4 |
| "BÃ¡sculas RS-232" (sin matiz) | "Torrey, Rhino y Dibal, pendiente de validaciÃ³n fÃ­sica" | 08 Â§1/Â§6 |
| CTA "Ver DemostraciÃ³n" | "Ver capturas del sistema" (el ancla es un carrusel de capturas, no una demo) | Â§9 |
| Footer: "offline-first de ultra-alto rendimiento" | "offline-first con SQLite local" | 00 Â§1 |

El precio y los beneficios de la prueba (`30 dÃ­as gratis`, sin tarjeta) se conservan por ser decisiones comerciales; la versiÃ³n y el tamaÃ±o del instalador ya no se muestran (Â§14.2).

---

## 14. Copy positivo para el usuario final (excepciÃ³n 6, pedido explÃ­cito)

El criterio actual de **toda la landing** es explicar *quÃ© puede hacer el negocio*, no *cÃ³mo estÃ¡ implementado*. Aplica a hero, `KeyFeatures`, `shortcuts`, comparativa, FAQ, precios, CTA final, footer y `index.html` (meta description).

| Concepto | Texto que NO se debe usar | Texto vigente |
| :--- | :--- | :--- |
| Datos sin internet | "SQLite nativo en modo WAL", "transacciÃ³n atÃ³mica persistida", "se guarda en el ordenado" | "Todo queda registrado al momento y sigue disponible cuando vuelves a abrir el programa, incluso sin conexiÃ³n" |
| BÃ¡sculas | "pendiente de validaciÃ³n fÃ­sica", "puerto COM y baudios persistidos" | "Toma el peso directamente en la venta, sin digitar los gramos. Compatible con Torrey, Rhino y Dibal" |
| ImpresiÃ³n | "aÃºn no estÃ¡n integrados", "no ESC/POS ni ZPL" | "Tickets en 80 mm, 58 mm o carta, listos para descargar" |
| Requisitos | "No hay cifras oficiales de CPU, RAM o espacio en disco" | "NovusPOS funciona en Windows 10 y Windows 11 (en computadoras de 64 bits), asÃ­ que no necesitas la versiÃ³n mÃ¡s reciente para empezar" |
| Seguridad | "Respaldo verificado con SHA-256 en la carpeta de datos" | "Respaldos de tu informaciÃ³n y restauraciÃ³n cuando lo necesites" |
| Footer | "Servidores Cloud Sincronizados", "CertificaciÃ³n Fiscal", "Drivers OPOS", "arquitectura Windows x64", "Mesa de Ayuda 24/7" | "Tu negocio, siempre disponible", "ProtecciÃ³n de datos", "Centro de ayuda", "BÃ¡sculas y perifÃ©ricos" |

Titulares vigentes: hero `rÃ¡pido, confiable y siempre disponible`; caracterÃ­sticas `PENSADO PARA TU DÃA A DÃA` / `Todo para vender, controlar tu inventario y cerrar el dÃ­a con confianza`; comparativa `NOVUSPOS FRENTE A UN POS EN NUBE` / `Â¿Por quÃ© elegir NovusPOS para tu negocio?`. Los atajos `'Modal de pago'` y `'1-Click ticket directo'` pasaron a `'Ventana de cobro'` y `'Cobro en un clic'`.

> Regla: se mantiene la **veracidad funcional** (no se afirma impresiÃ³n tÃ©rmica conectada ni rendimiento inventado), pero se expresa en lenguaje de negocio. Si en el futuro se sincroniza con Stitch, **no restaurar** ninguno de estos textos. `Kbd` ya no se importa en `landing-data.tsx`: las descripciones de tarjetas son prosa, sin atajos inline.

### 14.1 Compatibilidad con Windows (excepciÃ³n a "solo Windows 11")

El FAQ `Â¿QuÃ© necesito para empezar?` y la lÃ­nea de `Pricing` indican **Windows 10 o Windows 11**. Evidencia verificada en el proyecto de escritorio `novus-post/`:

- `package.json`: `electron: ^39.2.6` (resuelto `39.8.10` en `package-lock.json`). El README oficial de Electron 39 indica: *"Windows (Windows 10 and up)"* y que el soporte para Windows 7/8/8.1 se eliminÃ³ en Electron 23.
- `electron-builder.yml`: `nsis.artifactName: NovusPOS-Setup-${version}-x64.exe` â†’ instalador de **64 bits**.
- No hay ningÃºn chequeo en el cÃ³digo que exija Windows 11; "Windows 11 Fluent Design / WinUI 3" en los contextos 00 y AGENTS.md es **estilo visual**, no requisito de sistema operativo.

Por eso el texto dice que no hace falta la versiÃ³n mÃ¡s reciente, pero **no menciona Windows 7/8/8.1** (no son compatibles). Si cambia la versiÃ³n de Electron o el target del instalador, revisar este apartado antes de tocar el copy.

### 14.2 Sin nÃºmero de versiÃ³n en la landing (pedido explÃ­cito)

Se retirÃ³ `2.4.0` de **todo** el copy visible porque se veÃ­a mal. `ReleasePill` pasÃ³ a llamarse `HighlightPill` y ahora dice `âš¡ TRABAJA SIN DEPENDER DE INTERNET`. Los subtÃ­tulos de los botones de descarga (hero y `Pricing`) y la lÃ­nea del CTA final pasaron a `30 dÃ­as gratis â€¢ sin tarjeta`. La columna de la comparativa dice solo `NovusPOS Desktop` y el enlace del footer dice `Novedades`. No reintroducir `v2.4.0`, `VersiÃ³n 2.4.0`, `~85 MB` ni `(.exe)` en la landing: la versiÃ³n real sigue viviendo en `novus-post/package.json` y en el nombre del artefacto de `electron-builder.yml`, no en el sitio web.

---

## 15. SecciÃ³n de productos (excepciÃ³n 7, pedido explÃ­cito)

`ProductCatalog.tsx` aÃ±ade `#productos` entre `#caracteristicas` y la comparativa, con enlace en `SiteHeader`. No existe en el HTML de Stitch: se creÃ³ a pedido del usuario para explicar **quÃ© tipos de productos se pueden administrar**, con texto concreto y tono humano (sin fÃ³rmulas tipo "Descubre", "Potencia", "En resumen" ni "AdemÃ¡s").

Contenido en `landing-data.tsx`, arrays `productGroups` (4 tarjetas), `productVarieties` (8 categorÃ­as con ejemplos concretos) y `productCapabilities` (6 datos de ficha). Fuente real: `novus-post/docs/context/03-INVENTORY-PRODUCTS.md` y `src/main/adapters/persistence/sqlite/migrations/006_seed_products.ts`. El bloque "AsÃ­ se ve el catÃ¡logo de un abasto" muestra 33 productos con su medida (gaseosa 600 ml, huevo 12 piezas, detergente 1 kg, aguacateâ€¦) para que se aprecie la variedad que se puede manejar; son nombres del catÃ¡logo de ejemplo del sistema, acortados para que se lean bien en una etiqueta.

| Tarjeta | Ejemplo visible | Respaldado por |
| :--- | :--- | :--- |
| Lo de todos los dÃ­as | Abarrotes, refrescos, lÃ¡cteos, panaderÃ­a, limpieza, cuidado personal, frutas y verduras | 8 categorÃ­as sembradas en `006_seed_products.ts` |
| Por pieza, por caja o por peso | Aguacate 1,450 kg, caja de 12 refrescos, detergente por litro | unidades `PIEZA`/`CAJA`/`KG`/`L` + `allow_decimal` |
| Tallas, colores y presentaciones | Camiseta talla M azul, botella 600 ml / 1,5 L | variantes con `attribute_name`/`attribute_value` |
| Combos, servicios e insumos | Combo desayuno, envÃ­o a domicilio, materia prima | `product_type` COMBO/SERVICE/INSUMOS + `combo_items` |

Capacidades: cÃ³digos de barras, costo y ganancia, precios por mayoreo, impuestos por producto, lotes y caducidad, existencias y avisos. Se dice *quÃ© hace*, nunca *cÃ³mo estÃ¡ implementado*: no aparecen `SKU`, `FEFO`, SQLite, `append-only`, `soft delete` ni IDs de impuestos. "Los productos que vencen primero son los que se descuentan primero" es la versiÃ³n en lenguaje de negocio del descarte FEFO.

> Si cambia el mÃ³dulo de productos en `novus-post`, revisar este apartado antes de tocar el copy. Mantener los ejemplos concretos: son los que hacen que el texto no parezca generado.

---

## 16. Vistas de Iniciar SesiÃ³n / Registro (excepciÃ³n 8, pedido explÃ­cito)

Pantalla de Stitch: `projects/14269822984035378146/screens/b7520097c4d14ab9913cf7ab915c00cd`, tÃ­tulo **"Iniciar SesiÃ³n / Registro - NovusPOS"**, DESKTOP 2560Ã—2048. HTML: `files/b7520097c4d14ab9913cf7ab915c00cd` (28.5 kB). Se bajÃ³ con `tools.stitch.download_file` desde `list_screens` del proyecto conocido. Es la fuente de verdad de clases, orden y tokens (el screenshot de Stitch no sirve de referencia tipogrÃ¡fica; ver Â§1).

**Rutas:** `/auth` abre registro (estado por defecto en Stitch) y `/auth/login` abre login. `App.tsx` decide por `window.location.pathname`; no hay hook de ruta ni `hashchange`. El header "Iniciar SesiÃ³n" apunta a `/auth/login`. El `#` queda reservado para anclas internas de la landing (`#productos`, `#descargar`, â€¦), que se enlazan como `/#productos` desde auth/panel. **No reintroducir `/#/auth/login`**: el doble `#` es un fragmento con barra, no una ruta, y puede fallar en hosting o al compartir enlaces.

**Layout (idÃ©ntico a Stitch):** body `bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-center items-center`; `main w-full flex items-center justify-center p-space-md`; contenedor `max-w-7xl my-auto py-space-md lg:py-space-xl`; tarjeta `grid grid-cols-1 lg:grid-cols-12 rounded-xl shadow-xl overflow-hidden bg-surface-container-lowest`; columna izquierda `lg:col-span-5` con gradiente `from-primary-container via-primary to-on-secondary-fixed`; derecha `lg:col-span-7`. Se conservan los dos blur decorativos, el sparkline SVG, los 3 beneficios, la tarjeta de garantÃ­a, los 4 items de la barra inferior, los tabs, el banner verde, los dos formularios, el divisor y los dos botones alternos.

**Assets:** `public/novuspos-logo-white.png` se generÃ³ desde `novuspos-logo.png` (que tiene fondo blanco opaco) poniendo transparente lo cercano a blanco y blanco el resto. El `brightness-0 invert` de Stitch convertÃ­a todo el PNG en un rectÃ¡ngulo blanco; no reintroducirlo.

**Copy auditado (no restaurar el de Stitch):**

| Stitch | Implementado |
| :--- | :--- |
| `VERSIÃ“N 2025.2 READY Â· DESKTOP + NUBE` | `LISTO PARA WINDOWS Â· TRABAJA SIN INTERNET` |
| `+40% Velocidad`, `1.8 seg`, `100% Uptime` | `Sin depender de internet`, `Al instante`, `Siempre listo` |
| Testimonial inventado (40% menos filas, 5 min, nunca se traba) | Tarjeta "Prueba sin riesgo" con datos reales de la prueba |
| "Compatibilidad nativa con impresoras tÃ©rmicas", "Cancela en un clic", "migraciÃ³n sin cargo" | BÃ¡sculas y tickets listos; sin tarjeta y sin comisiones; soporte desde la app |
| `Seguridad Bancaria TLS 1.3`, `Cifrado SSL 256-bit` | `Tu informaciÃ³n se queda en tu equipo`, `Tus datos protegidos` |
| `Compatible con Tickets ESC/POS`, `SincronizaciÃ³n en la Nube` | `Tickets listos para imprimir`, `Respaldos de tu informaciÃ³n` |
| Botones Google Workspace / Microsoft 365 | `Descargar para Windows` y `Ver capturas del sistema` |
| "Caja / Terminal Asociada" con 3 cajas | Campo eliminado: el login solo pide correo y contraseÃ±a |

Los formularios son **demostrativos**: `onSubmit` solo muestra una alerta; no existe backend de auth en la landing. `MS` se moviÃ³ a `shared/ui/MS.tsx` (con `filled` para `speed` y `workspace_premium`) para que landing y auth no se importen entre sÃ­.

> Al sincronizar con Stitch, conservar el layout y volver a aplicar esta tabla. No reintroducir versiÃ³n, nube, ESC/POS, TLS, SSO ni mÃ©tricas inventadas. Tampoco reintroducir el selector de "Perfil de acceso": el login solo envÃ­a `email` y `password` a `POST /auth/login`. Verificado con Chrome headless a 1280px en ambos modos.

---

## 17. Panel de Control de Clientes (excepciÃ³n 9, pedido explÃ­cito)

Pantalla de Stitch: `projects/14269822984035378146/screens/98a61d2fa58e4476ab0d250be8a57755`, tÃ­tulo **"Panel de Control de Clientes - NovusPOS"**, DESKTOP 2560Ã—3558. HTML: `screens/98a61d2fa58e4476ab0d250be8a57755/fileEntries/html` (37.8 kB), bajado con `tools.stitch.download_file`.

**Ruta:** `/panel` (el alert de login exitoso incluye "Abrir panel de control"). `PanelPage` = `PanelSidebar` (aside `fixed left-0 top-0 h-full w-64` + header `fixed top-0 left-64 right-0 h-16`) + `<div class="pl-64"><main class="relative pt-16 ...">` con `p-space-md lg:p-space-lg gap-space-lg`. La portada muestra solo `DashboardSection`; los mÃ³dulos viven en `/panel/suscripcion`, `/panel/respaldos` y `/panel/soporte`. El menÃº tiene cuatro items: ya no estÃ¡ *Cajas Registradoras* y *Soporte TÃ©cnico* apunta a su propia ruta.

**Layout idÃ©ntico:** mismos `shadow-sm`, `rounded-xl`, `bg-surface-container-lowest`, `blur-3xl`, `hover:translate-y-[-2px]`, `divide-y divide-surface-container`, `animate-pulse` y tipografÃ­as `numeric-keypad`/`font-mono`. El icono del sidebar usa `novuspos-icon.png` (recorte 140Ã—141 del logo) para no duplicar el texto "NovusPOS" junto a "Novus Portal".

**Copy auditado:** se retiraron `Build 2.4.0 Production`, `Descargar NovusPOS v2.4.0`, `NovusPOS-Setup-2.4.0-x64.exe (64.8 MB)`, `(.EXE)`, `MD5: ...`, `VersiÃ³n 2.4.0 Estable`, `ESC/POS`, `RS-232`, `SQLite`, `Zstandard`, `AES-256`, "sincronizaciÃ³n con la nube", `Auto-Sync`, `Offline-Ready`, `REG-WIN11-04`, `24/7 Disponible`, `Soporte VIP`, `Caja Central #1`, `Sincronizando ahora` y `ID: #8829`. Tampoco se muestran los KPIs de Stitch (*Mi SuscripciÃ³n*, *Tu Equipo de Cobro*, *Ãšltimo Respaldo*, *Soporte y GarantÃ­a*) ni el bloque de equipo asignado (*Nombre PC*, *Sistema Operativo*, *Equipo*, *Lista para usar*, *Cambiar equipo*): la clave de suscripciÃ³n vÃ¡lida activa todo el sistema de escritorio. La clave se muestra **completa y copiable** (la envÃ­a la API y cambia con cada pago); no se enmascara. Ver Â§22â€“Â§25.

> Al sincronizar con Stitch, conservar el layout y volver a aplicar estos reemplazos. Verificado con Chrome headless a 1280px.

---

## 18. Capa HTTP y sesiÃ³n global

`src/shared/services/apiClient.ts` usa **fetch nativo** (no aÃ±adir axios): `API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'`, inyecciÃ³n de `Authorization: Bearer` leyendo el token en cada peticiÃ³n, y errores tipados `ApiError` / `UnauthorizedError` / `ValidationError`. En 401 se limpia la sesiÃ³n y se redirige a `/auth/login`; en 422 se normalizan `issues` de FastAPI (`detail[].loc/msg`) y Laravel/Express (`errors`); en 500 se devuelve un mensaje genÃ©rico. `setUnauthorizedHandler` permite que el provider limpie el estado sin acoplar `apiClient` al contexto; `subscribeLoading` alimenta `isLoading`.

`src/shared/context/AuthContext.tsx` (provider) + `auth-context.ts` (definiciÃ³n, para fast refresh) + `src/shared/hooks/useAuth.ts`. El estado `session` se inicializa de forma **sÃ­ncrona** desde `localStorage` (cookie como respaldo del token), asÃ­ que no hay parpadeo al recargar. MÃ©todos: `login(token,user)`, `logout()`, `updateUser(partial)`. Usuario: `{ id, email, organizationName, role }`.

`src/shared/components/ProtectedRoute.tsx` muestra un skeleton MD3 (`progress_activity` + barra `animate-pulse`) mientras `isLoading` o no hay sesiÃ³n; la redirecciÃ³n se hace en `useEffect` con `window.location.replace('/auth/login')`. `App.tsx` envuelve `/panel` con Ã©l. `main.tsx` monta `<AuthProvider>`. El login real usa `POST /auth/login` â†’ `{ token, user }` y el sidebar ofrece logout. `vite-env.d.ts` y `.env.example` documentan `VITE_API_URL`.

> El registro sigue siendo demostrativo hasta que exista `POST /auth/register`. No mover la definiciÃ³n del contexto dentro de `AuthContext.tsx`: oxlint `only-export-components` avisa y rompe fast refresh.

---

## 19. Patrones de diseÃ±o y SOLID (regla para todo el front)

La capa de sesiÃ³n se refactorizÃ³ para que **cada mÃ³dulo tenga una sola razÃ³n de cambio**. Mantener esta separaciÃ³n al aÃ±adir cÃ³digo:

| PatrÃ³n | DÃ³nde | Responsabilidad |
| :--- | :--- | :--- |
| **Facade** | `src/shared/services/apiClient.ts` | Ãšnica API pÃºblica (`get/post/...`, errores y eventos re-exportados). El resto de la app **nunca** importa `services/http/*`. |
| **Transport** | `src/shared/services/http/transport.ts` | Solo `fetch`, Bearer y traducciÃ³n de cÃ³digos HTTP. |
| **Error type + parser** | `src/shared/services/http/errors.ts` | Errores tipados y normalizaciÃ³n de 422. |
| **Observer / event bus** | `src/shared/services/http/events.ts` | `unauthorized` y contador de peticiones en curso; desacopla HTTP del provider. |
| **Repository (DIP)** | `src/shared/lib/auth-storage.ts` | Interfaz `SessionStore` + implementaciÃ³n `sessionStore`; `AuthProvider` acepta `store` inyectable. |
| **Use case + Gateway (DIP)** | `src/features/auth/services/authService.ts` | `AuthGateway` (puerto), `httpAuthGateway` (adaptador) y `loginUseCase.execute`. |
| **Presentational / Container** | `AuthFormPanel` (presentacional) + `useLogin` (container) | El panel solo renderiza; el hook orquesta loader, errores y navegaciÃ³n. |
| **Guard** | `src/shared/components/ProtectedRoute.tsx` | Ãšnico lugar que decide si se renderiza una ruta privada. |
| **Route resolver** | `src/app/routeResolver.ts` | FunciÃ³n pura `resolveAppRoute(pathname)`; `App` solo compone. |
| **Context + hook** | `auth-context.ts` / `AuthContext.tsx` / `useAuth.ts` | DefiniciÃ³n, provider y consumidor separados (fast refresh + SRP). |

Reglas derivadas:

- **SRP:** un archivo = una responsabilidad. Si un componente empieza a parsear errores o a navegar, extrae un hook o un caso de uso.
- **OCP:** para cambiar el backend basta otro `AuthGateway`; para cambiar la persistencia, otro `SessionStore`. No tocar UI.
- **LSP:** cualquier `AuthGateway`/`SessionStore` debe cumplir la interfaz sin condicionar al consumidor.
- **ISP:** puertos pequeÃ±os (una sola operaciÃ³n en `AuthGateway`; cuatro en `SessionStore`).
- **DIP:** los mÃ³dulos de alto nivel (hook, provider) dependen de interfaces, no de `fetch` ni de `localStorage`.
- Componentes â‰¤ 300 lÃ­neas, hooks â‰¤ 200. Contenido y tipos compartidos en `data/`, `types.ts`, `lib/`; nunca imports cruzados entre features.

> No reintroducir lÃ³gica de login dentro de `AuthFormPanel` ni llamadas directas a `fetch` desde componentes. Verificado: build/lint limpios y 422/401/protected route funcionando tras el refactor.

---

## 20. Modo demo y conexiÃ³n a la API (API aÃºn no lista)

El backend todavÃ­a no existe, asÃ­ que el login tiene **dos adaptadores intercambiables** bajo el mismo puerto `AuthGateway` (Â§19):

- `demoAuthGateway` â€” sin red; acepta cualquier correo con `@` y contraseÃ±a de 4+ caracteres, simula 350 ms y devuelve `{ token: 'demo-token-*', user: { id, email, organizationName, role } }`. Valida con `ValidationError` para poder probar los mensajes de campo.
- `httpAuthGateway` â€” llama a `AUTH_ENDPOINTS.login` (`/auth/login`) mediante `apiClient` y espera `{ token, user }`.

`authGatewayFactory.resolveAuthGateway()` elige uno segÃºn `VITE_AUTH_MODE`:

```dotenv
# .env.example
VITE_API_URL=http://localhost:8000/api/v1
VITE_AUTH_MODE=demo   # demo | api
```

**Predeterminado: `demo`** (fallback cuando la variable no estÃ¡ definida). Para conectar al backend real, poner `VITE_AUTH_MODE=api` y la URL correcta; el comportamiento de la UI y del `AuthProvider` no cambia. Las rutas de la API viven en `src/shared/services/endpoints.ts` (`login`, `register`, `me`, `logout`).

`LoginForm` muestra un aviso *"Modo demostraciÃ³n: entra con cualquier correo y contraseÃ±a de 4 caracteres o mÃ¡s"* solo cuando `IS_DEMO_AUTH`; desaparece en modo `api`. El registro sigue demostrativo aunque exista `AUTH_ENDPOINTS.register`: no se introduce hasta que el backend lo implemente.

> Verificado: demo entra a `/panel` y muestra el email introducido; modo `api` con mock 422 muestra error general y por campo; build/lint limpios en ambos modos. Al terminar una prueba en modo `api`, reconstruir sin la variable para dejar el build por defecto en demo.

---

## 21. RecuperaciÃ³n de contraseÃ±a (2 pantallas de Stitch)

Screens de Stitch (mismo proyecto `14269822984035378146`):
- **Recuperar ContraseÃ±a - Solicitar Enlace** â†’ `projects/14269822984035378146/screens/54dd58adf2904fa2b26ba64f3876d27d/fileEntries/html`
- **Restablecer Nueva ContraseÃ±a** â†’ `projects/14269822984035378146/screens/57592e1e7d8241ec9751a890983bd430/fileEntries/html`

### Rutas limpias

| Ruta | Pantalla | Acceso |
| :--- | :--- | :--- |
| `/auth/recuperar` | Solicitar enlace | Link *"Â¿Olvidaste tu contraseÃ±a?"* del login |
| `/auth/restablecer?token=â€¦&email=â€¦` | Crear nueva contraseÃ±a | Solamente desde el enlace enviado al correo |

`resolveAppRoute` evalÃºa estas dos rutas **antes** del prefijo genÃ©rico `/auth`. `readRecoveryLinkParams(search)` (en `features/auth/lib/recoveryLink.ts`) es la Ãºnica funciÃ³n que lee `token`/`email` de la query. Sin `token`, la tarjeta muestra un banner pidiendo un enlace nuevo.

### Estructura (mismos patrones de Â§19/Â§20)

```
app/ForgotPasswordPage.tsx              # layout + glows + cabecera + pie (Stitch)
app/ResetPasswordPage.tsx               # layout + glows + pie (Stitch)
features/auth/components/recovery/
  RequestResetCard.tsx                  # presentacional, tarjeta de solicitud
  ResetPasswordCard.tsx                 # presentacional, tarjeta de nueva clave
  PasswordRequirements.tsx              # medidor de fuerza + checklist
features/auth/lib/
  recoveryLink.ts                       # parseo/construcciÃ³n del enlace (puro)
  passwordStrength.ts                   # analyzePassword / isStrongPassword (puro)
  formErrors.ts                         # toFormError compartido por los 3 hooks
features/auth/services/
  passwordRecoveryGateway.ts            # puerto: requestLink + reset
  demoPasswordRecoveryGateway.ts        # demo sin red (DEMO_RESET_TOKEN)
  httpPasswordRecoveryGateway.ts        # endpoints reales
  passwordRecoveryGatewayFactory.ts     # elige segÃºn VITE_AUTH_MODE
  passwordRecoveryService.ts            # requestPasswordResetUseCase / resetPasswordUseCase
features/auth/hooks/
  useForgotPassword.ts                  # container: loader, errores, banner de Ã©xito
  useResetPassword.ts                   # container: reset + login + redirect a /panel
```

### Contrato de API (a implementar en el backend)

En `AUTH_ENDPOINTS` (`shared/services/endpoints.ts`):
- `POST /auth/forgot-password` con `{ email }` â†’ responde 200/204. Errores 422 por campo se normalizan igual que login.
- `POST /auth/reset-password` con `{ token, email, password }` â†’ responde `{ token, user }` (auto-login: el botÃ³n dice *"Restablecer y acceder a mi cuenta"*).

`email` viaja en la query del enlace y se reenvÃ­a al endpoint. Si el backend usa otro nombre de campo, cambiar **solo** `httpPasswordRecoveryGateway.ts`.

### Modo demo

`VITE_AUTH_MODE=demo` (predeterminado) no hace red: `requestLink` valida `@` y muestra el banner *"Â¡Enlace enviado!"*; dentro del banner aparece **"Abrir enlace de demostraciÃ³n â†’"** que lleva a `/auth/restablecer?token=demo-reset-token&email=â€¦`. El reseteo exige 8 caracteres con mayÃºscula, minÃºscula, nÃºmero y sÃ­mbolo; al terminar entra a `/panel` con el correo introducido. En modo `api` ese enlace no aparece.

### Copy auditado (layout idÃ©ntico, texto honesto)

Se conservan clases y composiciÃ³n de Stitch, pero se sustituyen los textos falsos/tÃ©cnicos: `TERMINAL AUTORIZADA â€¢ CLOUD GATEWAY` â†’ `ACCESO SEGURO A TU CUENTA`; `Cifrado TLS 1.3 â€¢ CertificaciÃ³n PCI-DSS Compliant` â†’ `Tus datos estÃ¡n protegidos`; `cifrado AES-256 de extremo a extremo` â†’ `Tus credenciales se guardan de forma segura`; `Validando terminalâ€¦` â†’ `Enviando enlaceâ€¦`; `credencial de terminal` se elimina. Los enlaces de asistencia y legales llevan a `/` porque no hay pÃ¡ginas dedicadas.

> Verificado: ambas pantallas renderizan sin los textos sensibles; flujo demo completa llega a `/panel`; sin `token` aparece el aviso; modo `api` con mock 422 muestra error general y por campo en ambos endpoints; build/lint limpios.

---
## 22. Módulo de Suscripción

No hay diseño de Stitch para este módulo: usa los tokens MD3 del panel y el patrón de §19/§20. Muestra las suscripciones disponibles, el plan contratado y el historial de pagos asociado a cada suscripción.

### Estructura

```
features/subscription/
├── types.ts                         # Plan, Subscription, PaymentRecord, PaymentDraft
├── data/subscription-data.ts        # plans, demoSubscription, demoPayments, cuentas y bancos
├── lib/
│   ├── formatters.ts                # formatMoney / formatDate
│   ├── paymentValidation.ts         # reglas puras del pago
│   ├── paymentPresentation.ts       # plan del pago, mes, filtros y totales
│   ├── paymentDraftStore.ts         # caché local del borrador por suscripción
│   ├── paymentFormErrors.ts         # ValidationError → errores por campo
│   └── proofImage.ts                # valida y comprime el comprobante
├── services/                        # puerto + demo/HTTP + factory + fachada
├── hooks/                           # useSubscriptionOverview, usePaymentDraft, usePaymentSubmission
└── components/
    ├── SubscriptionOverview.tsx     # contenedor
    ├── PlanCatalog.tsx              # suscripciones disponibles (plan actual marcado)
    ├── SubscriptionCard.tsx         # plan contratado, estado y vigencia
    ├── PaymentHistoryTable.tsx      # tabla con resumen, filtros y búsqueda
    ├── PaymentSummaryStrip.tsx      # aprobados, total pagado y último mes
    ├── PaymentFilterBar.tsx         # chips de estado + búsqueda
    ├── PaySubscriptionModal.tsx     # modal de 3 pasos
    ├── PaymentSteps.tsx / PaymentMethodSelector.tsx / PaymentAccountCard.tsx / PaymentSummary.tsx / ProofUpload.tsx
```

El historial muestra **Suscripción** (nombre resuelto desde `subscriptionId`), **Mes pagado** (derivable de `paidAt`), referencia, fecha, método, banco, monto, estado y comprobante. El resumen se calcula solo con pagos reales; los filtros (Todos / Aprobados / En revisión / Rechazados) y la búsqueda por referencia o banco son puramente locales. El modal de 3 pasos, su caché de borrador y la aprobación/rechazo se mantienen igual.

### Contrato

En `BILLING_ENDPOINTS`: `GET /billing/subscription` (con `plans`, `subscription` y `payments`; si faltan, completa con `GET /billing/plans` y `GET /billing/payments`), `POST /billing/payments` y `PATCH /billing/payments/{id}/review`. La recarga posterior al pago no desmonta el modal. RBAC lo decide el backend, no la UI.

> Verificado con CDP en demo y `api` (mock): catálogo, plan actual, resumen, filtros, búsqueda y columna de suscripción visibles; sin errores de consola. `npm run build` y `npm run lint` limpios.

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

- **Clave completa y copiable**: la API la envía y se renueva con cada pago; el front nunca la genera ni la enmascara. En demo se deriva del pago aprobado guardado en `novuspos:demo-billing`.
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
    ├── LastBackupCard.tsx        # fecha del último respaldo
    └── InstallerCard.tsx         # descarga del instalador (contenido fijo)
```

Se eliminaron `DashboardStats.tsx` y `LicenseCard.tsx`, y los endpoints `license` y `release-device`: no existe asignación de equipo ni botón de cambio. El menú lateral tampoco muestra *Cajas Registradoras* ni etiquetas de equipo.

> Verificado con CDP en demo y `api` (mock): clave completa, estado activo, fecha de respaldo, sin pagos ni contadores en la portada; sin errores de consola. El mock confirmó `GET /panel/overview`.

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
