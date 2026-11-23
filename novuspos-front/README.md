# NovusPOS — Landing Page Oficial

Réplica exacta del diseño **"NovusPOS - Landing Page Oficial"** de Stitch. React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Material Design 3.

## Comandos

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # tsc -b + vite build
npm run lint     # oxlint
npm run preview  # servir el build
```

## Arquitectura

```text
src/
├── app/LandingPage.tsx           # SiteHeader + <main class="pt-20"> + secciones + Footer
├── features/landing/
│   ├── components/               # SiteHeader, Hero, HeroHeader, HeroMockup, KeyFeatures,
│   │   │                         # ProductCatalog, KeyboardCheatSheet, ComparisonTable,
│   │   │                         # Pricing, HardwareFaq, FinalCta, Footer, Kbd,
│   │   │                         # ScreenshotCarousel (carrusel del hero)
│   │   ├── HeroMockup.tsx           # wrapper que renderiza el carrusel
│   │   └── product/ProductCard.tsx  # ProductCard + CartRow (sin uso tras el carrusel)
│   └── data/landing-data.tsx     # Contenido tipado extraído de Stitch (JSX inline, mocks, tonos)
└── index.css                     # @font-face Material Symbols + @theme MD3 + shimmer
```

Alias `@/*` → `src/*`. Componentes ≤ 300 líneas, contenido en `data/`.

### Assets locales (sin CDN)

```text
public/
├── fonts/
│   ├── fonts.css                             # 4 @font-face con unicode-range
│   ├── plus-jakarta-sans-latin.woff2
│   ├── plus-jakarta-sans-latin-ext.woff2
│   ├── jetbrains-mono-latin.woff2
│   └── jetbrains-mono-latin-ext.woff2
├── MaterialSymbolsOutlined.ttf                # iconos Material Symbols
├── novuspos-logo.png                          # logo del header y footer
├── imagen/novusposventa.png                   # captura del sistema en el carrusel del hero
├── imagen/novuspos_producto.png               # captura del módulo de productos
├── imagen/novuspos_kardex.png                 # captura del módulo de Kardex
├── imagen/novus_caja.png                      # captura del módulo de caja
├── imagen/novus_cliente.png                   # captura del módulo de clientes
└── favicon.svg
```

`index.html` precarga los dos woff2 latin. No se usa `fonts.googleapis.com` ni `lh3.googleusercontent.com`: el diseño funciona offline y los assets de Stitch caducan.

## Diseño

La fuente visual de verdad es el **HTML + `tailwind.config`** de Stitch (`projects/14269822984035378146`, pantalla `82fef7e6f4a148cabdc44a42ef4d5ac6`). Los tokens, textos, iconos y espaciado replican ese diseño exactamente.

> El screenshot de Stitch renderizó todo en Times New Roman porque no cargó Google Fonts: no es referencia tipográfica. Los saltos de línea pueden diferir; el diseño real usa Plus Jakarta Sans.

### 🚨 Regla de Tailwind v4

Los tokens se declaran en `@theme` con el namespace correcto; **no escribir utilidades a mano**. Tampoco quitar `@source not "../public/imagen/*.html";` de `src/index.css`: los HTML de referencia de Stitch en esa carpeta generaban ~30 kB de CSS huérfano al ser escaneados por Tailwind.

| Namespace | Genera |
| :--- | :--- |
| `--color-*` | `bg-*`, `text-*`, `ring-*`, `bg-*/40` |
| `--text-*` (+ `--line-height` / `--font-weight`) | `text-*` |
| `--font-*` | `font-*` |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` |
| `--radius-*` | `rounded-*` |

Ejemplo: `--spacing-space-xl: 2.5rem` genera `p-space-xl`, `px-space-xl`, `gap-space-xl`, etc. Un namespace equivocado (p. ej. `--space-xl`) genera **ninguna** clase y falla en silencio.

## Verificación visual

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-sandbox `
  --hide-scrollbars --window-size=1280,7000 --screenshot="captura.png" "http://127.0.0.1:5173/"
```

Viewport de referencia: 1280px. Altura actual ≈4780px (hero de dos columnas; antes, 5523px con el carrusel apilado abajo).

## Carrusel de capturas del hero

`HeroMockup.tsx` ya no renderiza el terminal en JSX; muestra `ScreenshotCarousel`, que apila las imágenes de `public/imagen/` con el efecto de `nexusposgobal.com`: cada 4s la de arriba baja a `opacity-30` y se desplaza en 3D mientras la siguiente pasa al frente (transición de 1s). Se respeta `prefers-reduced-motion`.

El carrusel se muestra en la **columna derecha del hero** (`HeroHeader` usa `lg:grid-cols-2 items-center gap-space-xl`): el texto queda a la izquierda y las capturas se suben desde el fondo hasta la parte superior derecha. En móvil se apilan (texto arriba, capturas abajo).

El relevo ya está activo con cinco capturas, en orden de módulo: `novusposventa.png`, `novuspos_producto.png`, `novuspos_kardex.png`, `novus_caja.png` y `novus_cliente.png`. Las cuatro primeras usan `object-contain`; `novus_caja.png` es 1280×1384 (más alta que el contenedor 5:4) y lleva `fit: 'cover'` para mostrarse con `object-cover object-top`, sin bandas laterales. Para agregar más, coloca el PNG en `public/imagen/` y añade una entrada `{ src, alt }` al array `screenshots` en `src/features/landing/data/landing-data.tsx` (usa `fit: 'cover'` si la imagen es alta).

## Sección de productos (`#productos`)

`ProductCatalog.tsx` explica qué tipos de productos se pueden administrar: 4 grupos (artículos de uso diario, ventas por pieza/caja/peso, variantes de talla o presentación, combos/servicios/insumos) y 6 datos de cada ficha (códigos, costo y ganancia, precios por mayoreo, impuestos, lotes y caducidad, existencias). El contenido vive en `productGroups` y `productCapabilities` (`landing-data.tsx`) y sale del módulo real de inventario de `novus-post` (contexto 03). No está en el diseño de Stitch: se añadió a pedido explícito. Ver skill §15 y contexto 09 §5.10.

## Copy de la landing

Todo el texto está escrito para quien va a usar el sistema: beneficios claros y positivos, sin detalles internos (SQLite, WAL, RS-232, SHA-256, `append-only`, etc.) ni frases como "pendiente de validación" o "aún no integrados". La veracidad funcional se mantiene: no se anuncia impresión térmica conectada ni rendimiento inventado. Si agregas texto, sigue el criterio de la skill §14 y del contexto 09 §5.7.

> Antes de modificar, lee `.agents/skills/novuspos-web-landing/SKILL.md` y `novus-post/docs/context/09-LANDING-WEB.md`.
