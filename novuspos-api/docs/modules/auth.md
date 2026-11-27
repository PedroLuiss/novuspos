# Módulo: Auth

## Propósito

Autenticación, perfil y verificación de correo para usuarios del ecosistema NovusPOS.

## Estado

**Implementado.**

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---:|---|
| POST | `/api/v1/auth/login` | No | Inicia sesión, devuelve token y usuario. |
| POST | `/api/v1/auth/register` | No | Registra usuario/negocio y devuelve token. |
| GET | `/api/v1/auth/me` | Sí | Devuelve usuario autenticado. |
| POST | `/api/v1/auth/logout` | Sí | Revoca token actual. |
| PUT | `/api/v1/auth/profile` | Sí | Actualiza perfil (sin email). |
| POST | `/api/v1/auth/email/verification-notification` | Sí | Envía correo de verificación. |
| GET | `/api/v1/auth/email/verify/{id}/{hash}` | No (signed) | Verifica correo y redirige al front. |
| POST | `/api/v1/auth/forgot-password` | No | Envía enlace de recuperación. |
| POST | `/api/v1/auth/reset-password` | No | Restablece contraseña y devuelve token + usuario. |

## Contrato Front

- `AUTH_ENDPOINTS` en `novuspos-front/src/shared/services/endpoints.ts`.
- User shape:

```json
{
  "id": "1",
  "name": "Roberto Morales",
  "email": "user@example.com",
  "organizationName": "Mi Negocio",
  "businessSector": "Abarrotes",
  "role": "client",
  "emailVerifiedAt": "2026-11-27T10:00:00.000000Z"
}
```

## Requests

- Login: `{ email, password }`
- Register: `{ name, organization_name|business, business_sector|sector, email, password }`
- Profile update: `{ name, organization_name, business_sector? }`
- Forgot: `{ email }`
- Reset: `{ token, email, password }`

## Verificación de correo

- El registro no exige correo verificado: el usuario tiene 30 días de prueba.
- El usuario puede solicitar verificación desde el panel (`POST /auth/email/verification-notification`).
- El enlace de verificación usa ruta firmada `verification.verify` y redirige a `${FRONTEND_URL}/auth/verificar-correo?status=verified|already_verified|invalid`.
- `User` implementa `MustVerifyEmail`.

## Base de datos

- `users`: name, organization_name, business_sector, email, email_verified_at, password, ...
- `personal_access_tokens` (Sanctum)
- `password_reset_tokens`

## Archivos clave

- Controller: `app/Http/Controllers/Api/V1/AuthController.php`
- Service: `app/Services/Auth/AuthService.php`
- Repo: `app/Contracts/Repositories/UserRepositoryInterface.php`, `app/Repositories/UserRepository.php`
- Requests: `app/Http/Requests/Api/V1/Auth/*`
- Resource: `app/Http/Resources/Api/V1/UserResource.php`
- Provider: `app/Providers/AppServiceProvider.php` (URL de verificación)
- Tests: `tests/Feature/Api/V1/ProfileAndVerificationTest.php`

## Seguridad

- Sanctum Bearer tokens.
- Passwords hasheadas.
- Reset revoca tokens previos.
- Verificación con URL firmada.
- Validación con Form Requests.
