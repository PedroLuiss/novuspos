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
├── App.tsx                       # pathname: /auth… → AuthPage; /panel | /panel/suscripcion → PanelPage
├── app/LandingPage.tsx           # SiteHeader + <main class="pt-20"> + secciones + Footer
├── app/AuthPage.tsx              # split 5/7 de Iniciar Sesión / Registro
├── app/PanelPage.tsx             # Panel de Control de Clientes (sidebar + bento grid)
├── features/panel/               # PanelSidebar, PanelOverview, PanelLicense, PanelBackups
├── features/subscription/        # Suscripción: gateway, hooks, tarjeta, historial y modal de pago
├── shared/ui/MS.tsx              # icono Material Symbols (filled opcional)
├── features/auth/                # AuthBrandPanel, AuthFormPanel, formularios y datos
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

`ProductCatalog.tsx` explica qué tipos de productos se pueden administrar: 4 grupos (artículos de uso diario, ventas por pieza/caja/peso, variantes de talla o presentación, combos/servicios/insumos), 8 categorías con 33 ejemplos concretos y 6 datos de cada ficha (códigos, costo y ganancia, precios por mayoreo, impuestos, lotes y caducidad, existencias). El contenido vive en `productGroups`, `productVarieties` y `productCapabilities` (`landing-data.tsx`) y sale del módulo real de inventario de `novus-post` (contexto 03). No está en el diseño de Stitch: se añadió a pedido explícito. Ver skill §15 y contexto 09 §5.10.

## Vistas de Iniciar Sesión / Registro

Réplica de la pantalla de Stitch "Iniciar Sesión / Registro - NovusPOS" (mismo proyecto, screen `b7520097c4d14ab9913cf7ab915c00cd`). Se abre con `/auth` (registro) o `/auth/login` (login) desde el enlace del header. El `#` solo se usa para anclas internas (`/#productos`, `/#descargar`). El layout es class-por-class idéntico al HTML de Stitch; el copy se auditó con las mismas reglas que la landing (sin versión, nube, ESC/POS, TLS, SSO ni métricas inventadas). Los formularios son demostrativos: muestran una alerta, no hay backend. El logo blanco de la columna izquierda es `public/novuspos-logo-white.png` (el original tiene fondo blanco opaco). El registro ofrece 14 opciones en *Tipo de Comercio*, perfiles de pymes venezolanas que el escritorio atiende (peso por kg, lotes con vencimiento, variantes, combos y cuentas corrientes), con selección obligatoria. Ver skill §16 y contexto 09 §5.11.

## Panel de Control de Clientes

Réplica del dashboard de Stitch "Panel de Control de Clientes - NovusPOS" (screen `98a61d2fa58e4476ab0d250be8a57755`), montado en `/panel`. Conserva sidebar y header; la portada muestra la clave completa y copiable, el estado de la suscripción y la fecha del último respaldo, sin KPIs ni asignación de equipo. El menú tiene cuatro items (ya no *Cajas Registradoras*) y las rutas limpias son `/panel/suscripcion`, `/panel/respaldos` y `/panel/soporte`. El copy se auditó igual que auth (sin versión, `.EXE`, ESC/POS, SQLite, nube, AES-256 ni token real). El icono del sidebar es `public/novuspos-icon.png`. Ver skill §17 y contexto 09 §5.12.

## Capa HTTP y sesión

`src/shared/services/apiClient.ts` es la fachada pública; la implementación está en `src/shared/services/http/` (transporte, errores y bus de eventos). Usa `fetch` con base URL `VITE_API_URL` (ver `.env.example`), cabecera Bearer y errores tipados: 401 limpia la sesión y redirige, 422 expone errores por campo, 500 muestra un mensaje amigable. `AuthProvider` (en `main.tsx`) hidrata la sesión desde `localStorage` sin parpadeo; `useAuth` expone `user`, `token`, `isAuthenticated`, `isLoading`, `login`, `logout` y `updateUser`. `/panel` está protegido por `ProtectedRoute` y el login consume `POST /auth/login` con `{ token, user }` a través de `AuthGateway` + `useLogin`. La arquitectura aplica Facade, Repository, Observer, caso de uso con DIP y componentes presentacionales: ver skill §19 y contexto 09 §5.13.

El backend aún no existe: `VITE_AUTH_MODE=demo` (predeterminado) permite entrar con cualquier correo y contraseña de 4+ caracteres; al tener la API, cambia a `VITE_AUTH_MODE=api` y ajusta `VITE_API_URL`. Los endpoints están en `src/shared/services/endpoints.ts`. `ProtectedRoute` no usa el contador global de peticiones HTTP como estado de sesión (eso desmontaba las páginas y generaba un loop de peticiones); la sesión se hidrata de forma síncrona. Ver skill §20.

### Recuperación de contraseña

Dos pantallas replicadas de Stitch: `/auth/recuperar` (solicitar enlace, accesible desde *"¿Olvidaste tu contraseña?"*) y `/auth/restablecer?token=…&email=…` (nueva clave, solo desde el correo). Layout class-por-class; el copy técnico de Stitch se sustituyó por texto honesto. Misma arquitectura que el login: `PasswordRecoveryGateway` con adaptadores demo/API, casos de uso, hooks container y componentes presentacionales. Contrato del backend: `POST /auth/forgot-password` con `{ email }` y `POST /auth/reset-password` con `{ token, email, password }` → `{ token, user }` (auto-login). En modo demo el banner de éxito incluye *"Abrir enlace de demostración →"* para probar el flujo sin API. Ver skill §21 y contexto 09 §5.14.

## Módulo de Suscripción

Ruta limpia `/panel/suscripcion`. Muestra los dos planes disponibles —**NovusPOS Mensual** ($4.99/mes) y **NovusPOS Anual** ($59.99/año)— con el actual marcado y un botón *Elegir este plan* para cambiar de plan. La landing `#precios` muestra las mismas dos opciones. El historial asocia cada pago a su suscripción (`planId`), con mes pagado, filtros y búsqueda, sin tarjeta de totales. El modal de pago guía en 3 pasos: datos bancarios de Novus y elección de pago móvil/transferencia, datos del comprobante (referencia, fecha, banco, imagen) y confirmación, con edición desde el resumen. Los campos usan `src/shared/ui/FormFields.tsx`, los mismos componentes reutilizables del login (etiqueta, icono, foco, error y ayuda); el selector de método y la subida comparten `FieldShell`, y el resumen vive en `PaymentSummary.tsx`. El borrador se guarda en el navegador para retomarlo; al enviar, la suscripción queda **pendiente de evaluación** y al aprobar el pago pasa a **activa**. La tabla permite aprobar o rechazar: en demo como simulación y en `api` mediante el endpoint real (el backend debe aplicar RBAC).

Los planes y los datos bancarios son ejemplos editables en `src/features/subscription/data/subscription-data.ts`; en producción la lista llega de Laravel. Solo se puede cambiar de plan cuando la suscripción actual está vencida (`expired`, `cancelled` o `active` con fecha pasada); con una activa, el catálogo deshabilita el cambio y muestra *Disponible al vencer*. La renovación del plan actual sigue disponible. Laravel debe aplicar la misma regla. Al elegir pago móvil o transferencia, el modal consulta la **tasa BCV real del día** en `https://ve.dolarapi.com/v1/dolares/oficial` (fuente BCV, sin autenticación y con CORS abierto) y muestra la tasa, su fecha y el total en bolívares (`monto USD × tasa`). Si la consulta falla, usa la tasa guardada en `novuspos:exchange-rate` y, como último recurso, una de referencia avisando al usuario. Para usar el endpoint de Laravel cuando ya exista, define `VITE_EXCHANGE_RATE_API_URL=/billing/exchange-rate` (ruta relativa a `VITE_API_URL`); sin esa variable se consulta la API pública. El modal usa el precio y la periodicidad del plan elegido (`al mes` / `al año`) y envía `planId` en el cuerpo. Al aprobar el pago, el plan, el monto y la vigencia se actualizan según el intervalo (un mes o un año) y la clave del panel se renueva. Contrato conectado en `src/shared/services/endpoints.ts`: `GET /billing/subscription` → `{ plans, subscription, payments }` (si faltan planes o pagos se completan con `GET /billing/plans` y `GET /billing/payments`), `POST /billing/payments` con `{ subscriptionId, planId, method, reference, paidAt, bank, proofName, proofDataUrl }` → pago pendiente y `PATCH /billing/payments/{id}/review` → `{ payment, subscription }`. El modo `demo` es el predeterminado; con `VITE_AUTH_MODE=api` y `VITE_API_URL` se usan los endpoints reales. Ver skill §22 y contexto 09 §5.15.

## Módulo de Copias de Seguridad

Ruta limpia `/panel/respaldos`. Muestra **una sola tarjeta** con la copia más reciente de la cuenta, sin historial, verificación, descarga, alta manual ni indicadores de espacio. Si vuelves a instalar NovusPOS y entras con tu cuenta, tus datos quedan como si no hubiera pasado nada.

Contrato en `src/shared/services/endpoints.ts`: `GET /backups/latest` y `POST /backups` (upsert multipart con `database`, `created_at`, `sha256` y `source`, compatible con lo que envía el escritorio; esos campos no se muestran). El modo `demo` persiste un único objeto en `localStorage` y es el predeterminado; con `VITE_AUTH_MODE=api` se usan los endpoints reales. Ver skill §23 y contexto 09 §5.16.

## Panel general

La ruta `/panel` ya no usa bloques estáticos: `src/features/dashboard/` obtiene un único resumen mediante gateway + adaptadores demo/API + factory + servicio fachada + hook contenedor, y compone `DashboardBanner`, `AccessCard` y `LastBackupCard`. La tarjeta del instalador se quitó: el banner ya tiene un solo botón de descarga. La clave se muestra completa y copiable (la renueva la API con cada pago), el estado lo decide la API (*Activa*, *Pago en revisión*, *Inactiva · pendiente de pago*, *Cancelada*) y solo aparece la fecha del último respaldo. No hay KPIs, equipo asignado ni historial de pagos en la portada.

Contrato en `src/shared/services/endpoints.ts`: `GET /panel/overview` → `{ organizationName, planName, subscriptionStatus, dueAt, activationKey, activationKeyRenewsAt, lastBackupAt }`. El modo `demo` es el predeterminado; con `VITE_AUTH_MODE=api` se consumen los endpoints reales sin tocar la UI. Ver skill §24 y contexto 09 §5.17.

## Módulo de Soporte Técnico

Ruta limpia `/panel/soporte`. Formulario con correo precargado de la sesión, tema, asunto y detalle, validado con reglas puras antes de enviar. Usa los campos reutilizables de `shared/ui/FormFields.tsx` (se añadió `TextAreaField` con el mismo estilo del login). Al enviar aparece una alerta de éxito con el número de reporte y la opción de enviar otro; no hay listado de tickets.

Contrato: `POST /support/tickets` con `{ email, topic, subject, description, source: 'web' }` → `{ id, reference, message }`. Misma arquitectura de gateway + adaptadores demo/API + factory + fachada + hook contenedor + componentes. Ver skill §25 y contexto 09 §5.18.

## Copy de la landing

Todo el texto está escrito para quien va a usar el sistema: beneficios claros y positivos, sin detalles internos (SQLite, WAL, RS-232, SHA-256, `append-only`, etc.) ni frases como "pendiente de validación" o "aún no integrados". La veracidad funcional se mantiene: no se anuncia impresión térmica conectada ni rendimiento inventado. Si agregas texto, sigue el criterio de la skill §14 y del contexto 09 §5.7.

> Antes de modificar, lee `.agents/skills/novuspos-web-landing/SKILL.md` y `novus-post/docs/context/09-LANDING-WEB.md`.
