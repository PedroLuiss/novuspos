# Módulo: Landing

## Propósito

Proveer la configuración pública de la landing page de NovusPOS. El front (`novuspos-front`) consume esta configuración para renderizar secciones, copy, tema, logos y capturas.

## Estado

**Implementado (base pública).**

## Endpoint

| Método | Ruta | Auth | Descripción |
|---|---|---:|---|
| GET | `/api/v1/landing/config` | No | Obtiene la configuración actual de la landing. |

## Contrato Front

- Endpoint: `LANDING_ENDPOINTS.config = '/landing/config'`
- Front: `src/shared/services/landing/httpLandingGateway.ts`
- El front acepta: `payload.config ?? payload.landing ?? payload`
- Normaliza con `normalizeLandingConfig` y tiene fallback a defaults locales si falla.

## Response 200

```json
{
  "config": {
    "theme": { "primary": "#003ec7", "primaryContainer": "#0052ff", "secondary": "#006c49", "surface": "#f7f9fb", "onSurface": "#191c1e" },
    "sections": [{ "id": "features", "visible": true }],
    "screenshots": [{ "src": "/imagen/novusposventa.png", "alt": "...", "fit": "contain" }],
    "logos": {
      "header": { "src": "/novuspos-logo.png", "alt": "NovusPOS Logo" },
      "footer": { "src": "/novuspos-logo.png", "alt": "NovusPOS Logo" }
    },
    "copy": {
      "header": {},
      "hero": {},
      "features": {},
      "products": {},
      "comparison": {},
      "pricing": {},
      "faq": {},
      "finalCta": {},
      "footer": {}
    }
  },
  "updatedAt": "2026-11-26T00:00:00.000000Z"
}
```

> `updatedAt` puede omitirse cuando se devuelven defaults sin registro en BD.

## Base de datos

### Migración

- `database/migrations/2026_11_26_100000_create_landing_configs_table.php`

### Tabla `landing_configs`

| Columna | Tipo | Notas |
|---|---|---|
| id | bigint | PK |
| config | json | Configuración completa `LandingConfig` |
| created_at | timestamp | |
| updated_at | timestamp | |

## Archivos clave

- Ruta: `routes/api.php`
- Controller: `app/Http/Controllers/Api/V1/LandingConfigController.php`
- Modelo: `app/Models/LandingConfig.php`
- Defaults: `app/Support/LandingDefaults.php`
- Data defaults: `database/data/landing-defaults.json`
- Factory: `database/factories/LandingConfigFactory.php`
- Seeder: `database/seeders/LandingConfigSeeder.php`
- Test: `tests/Feature/Api/V1/LandingConfigTest.php`

## Comportamiento

- Si no hay registro en `landing_configs`, devuelve defaults desde `database/data/landing-defaults.json`.
- Si hay registros, devuelve el último por `id`.
- La config se guarda como JSON completo para compatibilidad con el editor/admin del front.

## Pendientes / siguiente fase

- `PUT /api/v1/admin/landing` para que el dueño edite la landing (contrato ya existe en front: `ADMIN_ENDPOINTS.landing`).
- Validación server-side del shape de config antes de guardar.
- Versionado/historial de cambios opcional.

## Pruebas

```bash
php artisan test --compact --filter=LandingConfigTest
```
