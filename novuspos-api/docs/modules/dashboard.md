# Módulo: Dashboard (Panel usuario)

## Propósito

Resumen del panel de control del usuario: organización, plan, estado de suscripción, clave de activación y última copia.

## Estado

**Implementado (base).**

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---:|---|
| GET | `/api/v1/panel/overview` | Sí (Bearer) | Retorna resumen del panel. |

## Contrato Front

- `PANEL_ENDPOINTS.overview = /panel/overview`
- Front: `src/features/dashboard/services/httpDashboardGateway.ts`
- Tipo: `DashboardSummary`

## Response 200

```json
{
  "organizationName": "Mi Negocio",
  "planName": "NovusPOS Mensual",
  "subscriptionStatus": "active",
  "dueAt": "2026-12-27",
  "activationKey": "NVUS-XXXX-XXXX-DEMO-XXXX",
  "activationKeyRenewsAt": "2026-12-27",
  "lastBackupAt": "2026-11-27T10:00:00.000000Z"
}
```

## Archivos clave

- Ruta: `routes/api.php`
- Controller: `app/Http/Controllers/Api/V1/Dashboard/DashboardController.php`
- Service: `app/Services/Dashboard/DashboardService.php`
- Repos usados: `SubscriptionRepository`, `PlanRepository`, `BackupRepository`
- Test: `tests/Feature/Api/V1/PanelEndpointsTest.php`

## Notas

- Si el usuario no tiene suscripción, se crea una por defecto (plan mensual activo).
- `subscriptionStatus` se normaliza a `inactive` si la fecha de vencimiento ya pasó.
