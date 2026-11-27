---
name: novuspos-api-guide
description: Guía de arquitectura y convenciones para la API de NovusPOS. Usar cuando se creen o modifiquen endpoints, migraciones, modelos, controladores, tests o documentación de módulos en novuspos-api.
---

# NovusPOS API Guide

## Cuándo usar este skill

Usar siempre que se trabaje en `novuspos-api/`, especialmente al:

- crear o modificar endpoints `/api/v1/...`
- agregar migraciones/modelos/factories/seeders
- conectar contratos con `novuspos-front`
- documentar módulos de la API

## Flujo obligatorio

1. Leer `docs/README.md` y `docs/architecture.md`.
2. Leer `docs/modules/<modulo>.md` del módulo afectado. Si no existe, crearlo desde `docs/modules/_template.md`.
3. Revisar contrato front en `novuspos-front/src/shared/services/endpoints.ts` y gateways relacionados.
4. Si cambia el esquema, crear migración nueva (no editar migraciones ya aplicadas en entornos compartidos).
5. Implementar con convenciones Laravel: Form Requests, API Resources, Eloquent, tests feature.
6. Actualizar doc del módulo con endpoints, shapes, migraciones, archivos clave y pruebas.
7. Ejecutar Pint y tests relevantes.

## Mapa actual

| Módulo | Estado | Doc | Contrato front |
|---|---|---|---|
| Landing | Implementado base | `docs/modules/landing.md` | `LANDING_ENDPOINTS.config` |
| Auth | Contrato definido | `docs/modules/auth.md` | `AUTH_ENDPOINTS.*` |

## Convenciones clave

- Base API: `/api/v1`.
- Auth protegida: Sanctum Bearer token.
- Respuestas JSON compatibles con el front; errores 422 estilo Laravel.
- Mantener docs dentro de `novuspos-api/docs/`.
- Al agregar un módulo nuevo: crear `docs/modules/<modulo>.md`, agregarlo al mapa en `docs/README.md` y en este skill.

## Checklist

- [ ] Migración creada si aplica
- [ ] Ruta en `routes/api.php`
- [ ] Controller/Request/Resource según necesidad
- [ ] Test feature agregado/actualizado
- [ ] Doc del módulo actualizada
- [ ] `vendor/bin/pint --dirty --format agent`
- [ ] `php artisan test --compact --filter=...`
