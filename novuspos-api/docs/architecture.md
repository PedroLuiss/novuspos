# Arquitectura API

## Estructura

```text
app/
  Contracts/Repositories/     # Interfaces de repositorios
  Repositories/               # Implementaciones Eloquent
  Services/                   # Lógica de negocio por módulo
    Auth/
    Backup/
    Billing/
    Dashboard/
    ExchangeRate/
    Landing/
    Support/
  Http/
    Controllers/Api/V1/       # Controladores delgados por módulo
    Requests/Api/V1/          # Form Requests de validación
    Resources/Api/V1/         # API Resources / transformación JSON
  Models/                     # Modelos Eloquent
  Providers/
    RepositoryServiceProvider.php  # Bindings interface -> implementation
  Support/                    # Helpers (ej. LandingDefaults)
bootstrap/app.php             # Registro de rutas web/api/console/health
routes/api.php                # Rutas API v1
database/
  migrations/                 # Cambios de esquema
  data/                       # Datos estáticos (ej. landing-defaults.json)
  seeders/
  factories/
docs/                         # Documentación para agentes/desarrolladores
tests/Feature/Api/V1/         # Tests por módulo
```

## Patrón de diseño

- **Controller**: recibe request, delega a Service, retorna JSON. Sin lógica de negocio.
- **Service**: orquesta casos de uso, reglas, composición de repositorios.
- **Repository Interface** (`Contracts/Repositories`): contrato de acceso a datos.
- **Repository** (`Repositories`): implementación Eloquent del contrato.
- **Binding**: `RepositoryServiceProvider` registra `interface => implementation`.

Esto permite cambiar la fuente de datos, testear con mocks y mantener controladores pequeños.

## Versionado y rutas

- Base: `/api/v1`.
- Rutas públicas: sin middleware auth.
- Rutas protegidas: `auth:sanctum` (Bearer token).
- Contratos alineados con `novuspos-front/src/shared/services/endpoints.ts`.

## Autenticación

- Sanctum Personal Access Tokens.
- Front envía `Authorization: Bearer <token>`.
- Respuesta de login/register/reset: `{ token, user }`.
- `user`: `{ id, email, organizationName, role }`.

## CORS

- Permitir origen del front (`FRONTEND_URL`, por defecto `http://localhost:5173`).
- Configurar `config/cors.php` cuando se publique/personalice.

## Formato de respuestas

- Éxito: JSON con recurso o shape esperado por el front.
- Validación: 422 con estructura estándar Laravel (`message`, `errors`).
- No autenticado: 401.
- No encontrado: 404.

## Base de datos y migraciones

- Crear migración por cada cambio de esquema.
- Para JSON de configuración, usar columna `json` y cast `array` en Eloquent.
- Testing usa SQLite en memoria (`phpunit.xml`).

## Documentación por módulo

Cada módulo en `docs/modules/` debe incluir: propósito, endpoints, auth, request/response, migraciones/tablas, archivos clave, pruebas y notas de integración con front.
