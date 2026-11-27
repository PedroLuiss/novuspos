# Módulos API NovusPOS

## Landing
- Estado: implementado (base)
- Doc: `docs/modules/landing.md`
- Front: `LANDING_ENDPOINTS.config` (`/landing/config`)
- Endpoint: `GET /api/v1/landing/config`
- DB: `landing_configs.config` JSON
- Archivos: `LandingConfigController`, `LandingConfig`, `LandingDefaults`, `database/data/landing-defaults.json`

## Auth
- Estado: contrato definido, pendiente implementación
- Doc: `docs/modules/auth.md`
- Front: `AUTH_ENDPOINTS.*`
- Endpoints: login/register/me/logout/forgot-password/reset-password
- Nota: requiere Sanctum tokens y campos de organización en users.
