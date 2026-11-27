# Arquitectura API

## Estructura

```text
app/
  Http/Controllers/Api/V1/   # Controladores por versión/módulo
  Models/                    # Modelos Eloquent
  Support/                   # Helpers/clases de soporte (ej. defaults)
bootstrap/app.php            # Registro de rutas web/api/console/health
routes/api.php               # Rutas API v1
database/
  migrations/                # Cambios de esquema
  data/                      # Datos estáticos (ej. landing-defaults.json)
  seeders/
  factories/
docs/                        # Documentación para agentes/desarrolladores
tests/Feature/Api/V1/        # Tests por módulo
```

## Versionado y rutas

- Base: `/api/v1`.
- Rutas públicas: sin middleware auth.
- Rutas protegidas: `auth:sanctum` (Bearer token).
- Contratos deben alinearse con `novuspos-front/src/shared/services/endpoints.ts`.

## Autenticación

- **Planeada/contratada**: Sanctum Personal Access Tokens.
- El front envía `Authorization: Bearer <token>`.
- Respuesta de login/register/reset: `{ token, user }`.
- `user` esperado por front: `{ id, email, organizationName, role }`.

## CORS

- Permitir origen del front (`FRONTEND_URL`, por defecto `http://localhost:5173`).
- Configurar `config/cors.php` cuando se publique/personalice.

## Formato de respuestas

- Éxito: JSON con recurso o `{ data/config/... }` según contrato del módulo.
- Validación: 422 con estructura estándar Laravel (`message`, `errors`).
- No autenticado: 401.
- No encontrado: 404.

## Base de datos y migraciones

- Crear migración por cada cambio de esquema.
- Para JSON de configuración, usar columna `json` y cast `array` en Eloquent.
- Testing usa SQLite en memoria (`phpunit.xml`).

## Documentación por módulo

Cada módulo en `docs/modules/` debe incluir: propósito, endpoints, auth, request/response, migraciones/tablas, archivos clave, pruebas y notas de integración con front.
