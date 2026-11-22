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
│   │   │                         # KeyboardCheatSheet, ComparisonTable, Pricing,
│   │   │                         # HardwareFaq, FinalCta, Footer, Kbd,
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
└── favicon.svg
```

`index.html` precarga los dos woff2 latin. No se usa `fonts.googleapis.com` ni `lh3.googleusercontent.com`: el diseño funciona offline y los assets de Stitch caducan.

## Diseño

La fuente visual de verdad es el **HTML + `tailwind.config`** de Stitch (`projects/14269822984035378146`, pantalla `82fef7e6f4a148cabdc44a42ef4d5ac6`). Los tokens, textos, iconos y espaciado replican ese diseño exactamente.

> El screenshot de Stitch renderizó todo en Times New Roman porque no cargó Google Fonts: no es referencia tipográfica. Los saltos de línea pueden diferir; el diseño real usa Plus Jakarta Sans.

### 🚨 Regla de Tailwind v4

Los tokens se declaran en `@theme` con el namespace correcto; **no escribir utilidades a mano**:

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

Viewport de referencia: 1280px. Altura actual ≈5520px (el carrusel de capturas sustituye al mockup HTML de Stitch).

## Carrusel de capturas del hero

`HeroMockup.tsx` ya no renderiza el terminal en JSX; muestra `ScreenshotCarousel`, que apila las imágenes de `public/imagen/` con el efecto de `nexusposgobal.com`: cada 4s la de arriba baja a `opacity-30` y se desplaza en 3D mientras la siguiente pasa al frente (transición de 1s). Se respeta `prefers-reduced-motion`.

Para activar el relevo, agrega más PNG en `public/imagen/` y una entrada `{ src, alt }` al array `screenshots` en `src/features/landing/data/landing-data.tsx`.

> Antes de modificar, lee `.agents/skills/novuspos-web-landing/SKILL.md` y `novus-post/docs/context/09-LANDING-WEB.md`.
