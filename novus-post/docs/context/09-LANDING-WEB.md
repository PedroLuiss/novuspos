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
├── app/LandingPage.tsx                # SiteHeader + <main class="pt-20"> + secciones + Footer
├── features/landing/
│   ├── components/
│   │   ├── SiteHeader.tsx             # header fixed h-20 (logo local)
│   │   ├── HeroHeader.tsx             # helper MS + ReleasePill + cabecera hero
│   │   ├── HeroMockup.tsx             # wrapper del carrusel (antes: mockup HTML del POS)
│   │   ├── ScreenshotCarousel.tsx     # carrusel 3D apilado, relevo suave estilo NexusPOS
│   │   ├── product/ProductCard.tsx    # ProductCard + CartRow (sin uso tras el carrusel)
│   │   ├── Kbd.tsx                    # atajo inline <strong class="font-mono">
│   │   ├── Hero.tsx                   # glow + HeroHeader + HeroMockup
│   │   ├── KeyFeatures.tsx            # 6 tarjetas (#caracteristicas)
│   │   ├── KeyboardCheatSheet.tsx     # F1,F2,F3,F4,F5,F12,ALT+Q
│   │   ├── ComparisonTable.tsx        # Desktop vs POS Nube
│   │   ├── Pricing.tsx                # plan único $4.99 (#precios)
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

## 3. Orden de secciones (idéntico a Stitch)

1. `SiteHeader` — fijo, logo + Características/Precios/Documentación + Iniciar Sesión.
2. `Hero` — glow; grid de 2 columnas en desktop: texto a la izquierda (píldora, headline, slogan, CTAs, trust badges) y carrusel de capturas (`#interfaz-en-vivo`) arriba a la derecha. En móvil se apila.
3. `KeyFeatures` (`#caracteristicas`) — 6 tarjetas: terminal POS, inventario, Kardex, Corte Z, básculas RS-232, créditos.
4. `KeyboardCheatSheet` — 7 atajos.
5. `ComparisonTable` — 5 filas comparativas.
6. `Pricing` (`#precios`) — licencia profesional $4.99, badge "PRIMER MES $0".
7. `HardwareFaq` — 3 preguntas (SQLite WAL, periféricos, requisitos Windows).
8. `FinalCta` (`#descargar`) — gradiente primary→on-primary-fixed-variant.
9. `Footer` — producto, desarrolladores & soporte, seguridad & legal, línea legal.

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

   Para agregar capturas: copiar el PNG a `public/imagen/` y añadir un objeto `{ src, alt }` al array `screenshots` en `landing-data.tsx`. Con una sola imagen no hay relevo visible, pero el componente ya está preparado. `ProductCard.tsx` y los mocks del carrito quedaron sin uso (no eliminados por si se requieren después).

---

## 6. Estado y verificación

- ✅ Réplica exacta de Stitch validada sección por sección con capturas headless de Chrome a 1280px contra el HTML renderizado y el screenshot oficial.
- ✅ Altura final ≈4780px con el hero de dos columnas (antes, 5523px con el carrusel apilado abajo; oficial 5350px). Posición del carrusel a 1280px: `x≈660, y≈230, w≈596, h≈477`.
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
