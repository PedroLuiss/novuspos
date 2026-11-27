# Módulos API NovusPOS

## Landing
- Estado: implementado
- Doc: `docs/modules/landing.md`
- Endpoint: `GET /api/v1/landing/config`
- DB: `landing_configs.config` JSON

## Auth
- Estado: implementado (base)
- Doc: `docs/modules/auth.md`
- Endpoints: login/register/me/logout/forgot-password/reset-password
- DB: `users`, `personal_access_tokens`, `password_reset_tokens`

## Dashboard
- Estado: implementado
- Doc: `docs/modules/dashboard.md`
- Endpoint: `GET /api/v1/panel/overview` (auth)

## Billing
- Estado: implementado (base)
- Doc: `docs/modules/billing.md`
- Endpoints: plans, payment-methods, subscription, payments, review
- DB: `plans`, `payment_methods`, `subscriptions`, `payments`

## Backups
- Estado: implementado
- Doc: `docs/modules/backups.md`
- Endpoints: `GET /backups/latest`, `POST /backups` (auth)
- DB: `backups`

## Support
- Estado: implementado
- Doc: `docs/modules/support.md`
- Endpoint: `POST /support/tickets` (auth)
- DB: `support_tickets`

## Exchange Rate
- Estado: implementado (fallback)
- Doc: `docs/modules/exchange-rate.md`
- Endpoint: `GET /billing/exchange-rate`
