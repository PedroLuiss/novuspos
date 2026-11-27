# Módulo: Landing

## Propósito

Proveer la configuración pública de la landing page de NovusPOS. El front (`novuspos-front`) consume esta configuración para renderizar secciones, copy, tema, logos y capturas.

## Estado

**Implementado.**

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---:|---|
| GET | `/api/v1/landing/config` | No | Obtiene la configuración actual de la landing. |
| GET | `/api/v1/landing/download` | Sí (Sanctum) | Descarga el instalador .exe publicado; 404 si no hay archivo. Requiere usuario autenticado. |
| GET | `/api/v1/admin/landing` | Sí (`super-admin`) | Obtiene la configuración completa para el constructor. |
| PUT | `/api/v1/admin/landing` | Sí (`super-admin`) | Guarda la configuración completa `{config: LandingConfig}`. |
| POST | `/api/v1/admin/landing/download` | Sí (`super-admin`) | Sube/reemplaza el instalador .exe. Multipart: `file` (.exe, máx 512MB), `version?`. |
| DELETE | `/api/v1/admin/landing/download` | Sí (`super-admin`) | Quita el instalador publicado de la landing. |

## Contrato Front

- Endpoint público: `LANDING_ENDPOINTS.config = '/landing/config'`, `LANDING_ENDPOINTS.download = '/landing/download'`
- Endpoint admin: `ADMIN_ENDPOINTS.landing = '/admin/landing'`, `ADMIN_ENDPOINTS.landingDownload = '/admin/landing/download'`
- Front: `src/shared/services/landing/httpLandingGateway.ts`, `src/features/admin/modules/landing/*`
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
    "download": {
      "url": "https://.../api/v1/landing/download",
      "fileName": "NovusPOS-Setup-x64.exe",
      "sizeBytes": 85000000,
      "version": "2.5.0",
      "updatedAt": "2026-11-27T00:00:00.000000Z"
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
- Controller público: `app/Http/Controllers/Api/V1/LandingConfigController.php`
- Controller admin: `app/Http/Controllers/Api/V1/Admin/AdminLandingController.php`
- Service: `app/Services/Landing/LandingConfigService.php`
- Request save: `app/Http/Requests/Api/V1/Admin/AdminSaveLandingRequest.php`
- Request upload: `app/Http/Requests/Api/V1/Admin/AdminUploadLandingDownloadRequest.php`
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
- `download` puede ser `null` o `{url,fileName,sizeBytes,version?,updatedAt?}`.
- El instalador se guarda en disco `public` en `landing/novuspos-desktop-setup.exe`; al subir uno nuevo se reemplaza.
- El endpoint `GET /landing/download` requiere autenticación Sanctum y hace stream del archivo con `Content-Disposition: attachment`.

## Pendientes / siguiente fase

- Validación server-side del shape completo de config antes de guardar.
- Versionado/historial de cambios opcional.
- Autenticación/firma de URL si el instalador deja de ser público.

## Pruebas

```bash
php artisan test --compact --filter=LandingConfigTest
```
