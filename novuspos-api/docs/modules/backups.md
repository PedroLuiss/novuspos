# Módulo: Backups

## Propósito

Guardar y consultar la **última copia de seguridad** de la cuenta del usuario. Solo se conserva la copia más reciente.

## Estado

**Implementado (base).**

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---:|---|
| GET | `/api/v1/backups/latest` | Sí | Retorna la última copia o `null`. |
| POST | `/api/v1/backups` | Sí | Sube/reemplaza la copia (multipart). |

## Contrato Front

- `BACKUP_ENDPOINTS.latest = /backups/latest`, `BACKUP_ENDPOINTS.upload = /backups`
- Front: `src/features/backups/services/httpBackupGateway.ts`

## Request (POST multipart)

- `database`: archivo (required)
- `created_at`: string (required)
- `sha256`: string (optional)
- `source`: string (optional, default `novuspos-desktop`)

## Response

```json
{ "id":"1", "createdAt":"2026-11-27T10:00:00.000000Z", "sizeBytes":102400, "source":"novuspos-desktop" }
```

## Base de datos

Tabla `backups`: user_id, file_path, file_name, size_bytes, checksum, source, backup_created_at, timestamps.

## Archivos clave

- Controller: `Api/V1/Backup/BackupController`
- Service: `Services/Backup/BackupService`
- Repo: `BackupRepository`
- Request: `StoreBackupRequest`
- Test: `tests/Feature/Api/V1/PanelEndpointsTest.php`

## Notas

- Al subir una nueva copia, se elimina la anterior (registro y archivo en disco local).
- Archivos se guardan en `storage/app/backups/{user_id}`.
