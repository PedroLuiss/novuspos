# Módulo: Exchange Rate

## Propósito

Proveer la tasa BCV del día para conversión USD/VES en el panel.

## Estado

**Implementado (base con fallback).**

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---:|---|
| GET | `/api/v1/billing/exchange-rate` | No | Retorna tasa del día. |

## Contrato Front

- `EXCHANGE_RATE_ENDPOINTS.today = /billing/exchange-rate`
- Front: `src/shared/services/exchange-rate/httpExchangeRateGateway.ts`
- El front puede usar `VITE_EXCHANGE_RATE_API_URL`; por defecto apunta a este endpoint.

## Response 200

```json
{ "rate": 36.5, "currency":"USD", "date":"2026-11-27", "source":"BCV" }
```

En fallback:
```json
{ "rate": 36.5, "currency":"USD", "date":"2026-11-27", "source":"BCV", "fallback": true }
```

## Archivos clave

- Controller: `Api/V1/ExchangeRate/ExchangeRateController`
- Service: `Services/ExchangeRate/ExchangeRateService`

## Notas

- Intenta consultar `https://ve.dolarapi.com/v1/dolares/oficial`.
- Cachea 6 horas. Si falla, retorna fallback marcado.
