# Módulo: Billing (Planes, Suscripción, Pagos, Métodos)

## Propósito

Gestiona el catálogo de planes, métodos de pago, suscripción actual del usuario, reporte de pagos y revisión.

## Estado

**Implementado (base usuario).**

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---:|---|
| GET | `/api/v1/billing/plans` | No | Lista planes activos. |
| GET | `/api/v1/billing/payment-methods` | No | Lista métodos de pago activos. |
| GET | `/api/v1/billing/subscription` | Sí | Overview: `{plans, subscription, payments}`. |
| GET | `/api/v1/billing/payments` | Sí | Lista pagos del usuario. |
| POST | `/api/v1/billing/payments` | Sí | Registra pago (queda `pending_review`). |
| PATCH | `/api/v1/billing/payments/{payment}/review` | Sí | Aprueba/rechaza pago. |

## Contrato Front

- `BILLING_ENDPOINTS` en `novuspos-front/src/shared/services/endpoints.ts`
- Gateways: `httpPlansGateway`, `httpPaymentMethodsGateway`, `httpSubscriptionGateway`

## Shapes clave

### Plan
```json
{ "id":"novus-mensual","name":"NovusPOS Mensual","description":"...","price":4.99,"currency":"USD","interval":"month","features":[],"highlighted":true,"active":true }
```

### Subscription overview
```json
{ "plans":[...], "subscription":{ "id":"1","planId":"novus-mensual","status":"active","startedAt":"2026-11-27","renewsAt":"2026-12-27","amount":4.99,"currency":"USD" }, "payments":[...] }
```

### Submit payment request
```json
{ "subscriptionId":"1","planId":"novus-mensual","method":"mobile","reference":"123456","paidAt":"2026-11-27","bank":"Banco de Venezuela","proofName":"...","proofDataUrl":"..." }
```

## Base de datos

- `plans` (`slug`, name, description, price, currency, interval, features JSON, highlighted, active)
- `payment_methods` (`slug`, label, description, icon, active, rows JSON)
- `subscriptions` (user_id, plan_slug, status, started_at, renews_at, amount, currency)
- `payments` (subscription_id, user_id, plan_slug, reference, method, bank, paid_at, amount, currency, status, proof_name, proof_data_url, review_note)

## Archivos clave

- Controllers: `Api/V1/Billing/PlanController`, `PaymentMethodController`, `SubscriptionController`, `PaymentController`
- Services: `Services/Billing/PlanService`, `PaymentMethodService`, `SubscriptionService`
- Repos: `PlanRepository`, `PaymentMethodRepository`, `SubscriptionRepository`, `PaymentRepository`
- Requests: `StorePaymentRequest`, `ReviewPaymentRequest`
- Seeders: `PlanSeeder`, `PaymentMethodSeeder`
- Tests: `tests/Feature/Api/V1/PanelEndpointsTest.php`, `tests/Feature/Api/V1/ProfileAndVerificationTest.php`

## Reglas

- No cambiar de plan si la suscripción actual no está vencida (valida backend).
- Referencia + banco duplicados para el mismo usuario se rechazan.
- Pago aprobado activa suscripción, actualiza plan/monto y recalcula `renewsAt` según intervalo.
- **Verificación de correo para compra tras prueba:** al registrarse se crea una suscripción activa de 30 días (prueba). Durante la prueba no se exige correo verificado. Si la suscripción está vencida/expirada y el usuario intenta reportar un pago, el backend responde 422 exigiendo correo verificado.
