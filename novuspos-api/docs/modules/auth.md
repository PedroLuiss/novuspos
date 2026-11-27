# Módulo: Auth

## Propósito

Autenticación y gestión de sesión para usuarios del ecosistema NovusPOS (landing/panel cliente).

## Estado

**Implementado (base).**

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---:|---|
| POST | `/api/v1/auth/login` | No | Inicia sesión, devuelve token y usuario. |
| POST | `/api/v1/auth/register` | No | Registra usuario/negocio y devuelve token. |
| GET | `/api/v1/auth/me` | Sí | Devuelve usuario autenticado. |
| POST | `/api/v1/auth/logout` | Sí | Revoca token actual. |
| POST | `/api/v1/auth/forgot-password` | No | Envía enlace de recuperación. |
| POST | `/api/v1/auth/reset-password` | No | Restablece contraseña y devuelve token + usuario (auto-login). |

## Contrato Front

- `AUTH_ENDPOINTS` en `novuspos-front/src/shared/services/endpoints.ts`
- Response login/register/reset:

```json
{
  "token": "<bearer-token>",
  "user": { "id": "1", "email": "user@example.com", "organizationName": "Mi Negocio", "role": "client" }
}
```

## Requests

- Login: `{ email, password }`
- Register: `{ name, organization_name|business, business_sector|sector, email, password }`
- Forgot: `{ email }`
- Reset: `{ token, email, password }`

## Base de datos

- `users`: name, organization_name, business_sector, email, password, ...
- `personal_access_tokens` (Sanctum)
- `password_reset_tokens`

## Archivos clave

- Controller: `app/Http/Controllers/Api/V1/AuthController.php`
- Service: `app/Services/Auth/AuthService.php`
- Repo: `app/Contracts/Repositories/UserRepositoryInterface.php`, `app/Repositories/UserRepository.php`
- Requests: `app/Http/Requests/Api/V1/Auth/*`
- Resource: `app/Http/Resources/Api/V1/UserResource.php`

## Seguridad

- Sanctum Bearer tokens.
- Passwords hasheadas.
- Reset revoca tokens previos.
- Validación con Form Requests.
