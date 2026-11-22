---
name: novuspos-web-landing
description: Guía de arquitectura y diseño para la landing page oficial de NovusPOS (novuspos-front: React 19 + Vite + Tailwind v4). Úsala SIEMPRE que se modifique el sitio web, se componenticen vistas desde Stitch o se agreguen secciones al marketing.
---

# Skill: NovusPOS Web — Landing Page Oficial

Complementa a `novuspos-guide`. Aplica al repositorio **`novuspos-front/`** (sitio de marketing), distinto del shell Electron de `novus-post/`.

> 🛑 **Regla de oro:** la landing es una **réplica exacta** del diseño de Stitch **"NovusPOS - Landing Page Oficial"**. Textos, colores, iconos, clases y orden de secciones deben coincidir con el HTML de Stitch. **No improvises ni rediseñes.**

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
│   │   ├── HeroMockup.tsx              # mockup del terminal POS
│   │   ├── product/ProductCard.tsx     # ProductCard + CartRow
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
2. `Hero` — glow, píldora "⚡ NUEVA VERSIÓN 2.4.0 • …", headline, "Lema oficial", subtítulo, CTAs, 4 trust badges, mockup
3. `KeyFeatures` (`#caracteristicas`)
4. `KeyboardCheatSheet`
5. `ComparisonTable`
6. `Pricing` (`#precios`)
7. `HardwareFaq`
8. `FinalCta` (`#descargar`)
9. `Footer`

---

## 7. Checklist al modificar

- [ ] ¿Extraje textos/clases del HTML de Stitch con `download_file`?
- [ ] ¿Los tokens nuevos usan el namespace correcto de Tailwind v4?
- [ ] ¿Los assets nuevos son locales (no CDN)?
- [ ] ¿Usé `MS` para iconos y `Kbd` para atajos inline?
- [ ] ¿Se mantienen ids de ancla y orden de secciones?
- [ ] `npm run build` + `npm run lint` limpios.
- [ ] ¿Actualicé `novus-post/docs/context/09-LANDING-WEB.md`?

---

## 8. Verificación visual (sin Playwright)

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-sandbox `
  --hide-scrollbars --window-size=1280,7000 --screenshot="captura.png" "http://127.0.0.1:5173/"
```

El viewport de referencia es **1280px** (ahí `max-w-7xl` = 1280 y el diseño ocupa todo el ancho). El screenshot oficial mide 1280×5351; una implementación correcta ronda los 5300px de alto.

> El diseño usa MD3 (azul `#003ec7`/`#0052ff`), **no** el Fluent POS Engine del escritorio. No mezclar sistemas.
