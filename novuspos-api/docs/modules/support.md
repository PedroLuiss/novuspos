# Módulo: Support

## Propósito

Recibir reportes/tickets de soporte desde el panel web.

## Estado

**Implementado (base).**

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---:|---|
| POST | `/api/v1/support/tickets` | Sí | Crea ticket de soporte. |

## Contrato Front

- `SUPPORT_ENDPOINTS.submit = /support/tickets`
- Front: `src/features/support/services/httpSupportGateway.ts`

## Request

```json
{
  "email":"user@example.com",
  "topic":"ventas",
  "subject":"Ayuda",
  "description":"Detalle...",
  "source":"web"
}
```

`topic`: `acceso|instalacion|ventas|inventario|tickets|otro`.

## Response 201

```json
{ "id":"1", "reference":"TK-ABC123", "message":"Tu reporte fue recibido. Te responderemos pronto." }
```

## Base de datos

Tabla `support_tickets`: user_id nullable, reference unique, email, topic, subject, description, source, status, timestamps.

## Archivos clave

- Controller: `Api/V1/Support/SupportTicketController`
- Service: `Services/Support/SupportTicketService`
- Repo: `SupportTicketRepository`
- Request: `StoreSupportTicketRequest`
- Test: `tests/Feature/Api/V1/PanelEndpointsTest.php`
