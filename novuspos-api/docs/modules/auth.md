# Módulo: Auth

## Propósito

Autenticación y gestión de sesión para usuarios del ecosistema NovusPOS (landing/panel cliente). El front ya tiene gateways HTTP y contratos definidos.

## Estado

**Contrato definido / pendiente de implementación.**

## Endpoints contratados (front)

| Método | Ruta | Auth | Descripción |
|---|---|---:|---|
| POST | `/api/v1/auth/login` | No | Inicia sesión, devuelve token y usuario. |
| POST | `/api/v1/auth/register` | No | Registra usuario/negocio y devuelve token. |
| GET | `/api/v1/auth/me` | Sí | Devuelve usuario autenticado. |
| POST | `/api/v1/auth/logout` | Sí | Revoca token actual. |
| POST | `/api/v1/auth/forgot-password` | No | Envía enlace/token de recuperación. |
| POST | `/api/v1/auth/reset-password` | No | Restablece contraseña y devuelve token + usuario (auto-login). |

## Contrato Front

- Endpoints: `novuspos-front/src/shared/services/endpoints.ts` (`AUTH_ENDPOINTS`)
- Tipos: `src/shared/lib/auth-types.ts`, `src/features/auth/types.ts`
- Login/Register/Reset response esperado:

```json
{
  "token": "<bearer-token>",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "organizationName": "Mi Negocio",
    "role": "client"
  }
}
```

## Requests esperados

### Login
```json
{ "email": "user@example.com", "password": "secret" }
```

### Register (según formulario front)
Campos UI: nombre, negocio, tipo de comercio, email, contraseña. Mapear a API con nombres claros (`name`, `organization_name`/`business_name`, `business_sector`, `email`, `password`).

### Forgot password
```json
{ "email": "user@example.com" }
```

### Reset password
```json
{ "token": "...", "email": "user@example.com", "password": "NuevaClave123!" }
```

## Migraciones necesarias (al implementar)

- Publicar/ejecutar migración `personal_access_tokens` de Sanctum.
- Ampliar `users` con `organization_name`, `business_sector` (según definición final).
- Usar `password_reset_tokens` (ya existe en migración default).

## Archivos previstos

- Controller: `app/Http/Controllers/Api/V1/AuthController.php` (existe vacío)
- Form Requests: `app/Http/Requests/Api/V1/Auth/*`
- Resource: `app/Http/Resources/Api/V1/UserResource.php`
- Tests: `tests/Feature/Api/V1/Auth/*Test.php`

## Seguridad

- Rate limit en login/forgot/reset.
- Hash de contraseñas.
- Revocar tokens en logout/reset según política.
- No filtrar existencia de usuarios más de lo necesario.

## Notas

- El front actualmente tiene modo demo; al conectar, usar `VITE_AUTH_MODE=api`.
- El registro en UI aún puede requerir cableado adicional en front; el endpoint debe quedar listo.
