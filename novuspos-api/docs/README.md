# NovusPOS API — Documentación

API backend de NovusPOS. Sirve a los frontends del ecosistema (landing, panel de clientes, panel admin) y expone contratos REST versionados bajo `/api/v1`.

## Propósito

- Centralizar autenticación, configuración pública de landing, suscripciones, pagos, respaldos y administración.
- Mantener contratos claros para que cualquier agente o frontend pueda integrarse sin leer todo el código.

## Stack

- PHP 8.3 + Laravel 13
- MySQL (por defecto en `.env.example`) / SQLite en testing
- Sanctum para tokens Bearer (API)
- Spatie Permission para roles/permisos
- PHPUnit 12 para pruebas

## Inicio rápido

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

API local por defecto: `http://localhost:8000/api/v1`.

## Convenciones

- **Versionado**: rutas bajo `/api/v1`.
- **Auth**: Bearer token (`Authorization: Bearer <token>`) para endpoints protegidos.
- **Patrón**: Controllers delgados → Services (lógica) → Repositories/Contracts (acceso a datos). Bindings en `App\Providers\RepositoryServiceProvider`.
- **JSON**: respuestas JSON; errores de validación en formato Laravel 422 (`message`, `errors`).
- **Contratos front**: revisar `novuspos-front/src/shared/services/endpoints.ts` antes de cambiar rutas o shapes.
- **Migraciones**: todo cambio de esquema va en migración.
- **Docs por módulo**: al crear/cambiar un endpoint, actualizar `docs/modules/<modulo>.md`.

## Mapa de módulos

| Módulo | Estado | Doc | Endpoints principales |
|---|---|---|---|
| Landing | Implementado | [modules/landing.md](modules/landing.md) | `GET /landing/config` |
| Auth | Implementado (base) | [modules/auth.md](modules/auth.md) | `/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password` |
| Dashboard | Implementado | [modules/dashboard.md](modules/dashboard.md) | `GET /panel/overview` |
| Billing | Implementado (base) | [modules/billing.md](modules/billing.md) | `/billing/plans`, `/billing/payment-methods`, `/billing/subscription`, `/billing/payments` |
| Backups | Implementado | [modules/backups.md](modules/backups.md) | `/backups/latest`, `/backups` |
| Support | Implementado | [modules/support.md](modules/support.md) | `POST /support/tickets` |
| Exchange Rate | Implementado | [modules/exchange-rate.md](modules/exchange-rate.md) | `GET /billing/exchange-rate` |

## Documentación

- [Arquitectura](architecture.md)
- [Módulos](modules/)
- [Plantilla de módulo](modules/_template.md)

## Para agentes

Antes de modificar un módulo:
1. Leer este README y `architecture.md`.
2. Leer `docs/modules/<modulo>.md`.
3. Revisar el contrato en `novuspos-front/src/shared/services/endpoints.ts`.
4. Crear migración si cambia el esquema.
5. Agregar/actualizar tests feature.
6. Ejecutar `vendor/bin/pint --dirty --format agent`.
