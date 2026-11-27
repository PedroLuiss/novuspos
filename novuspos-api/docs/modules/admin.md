# Módulo: Admin (Super Admin)

## Propósito

Panel de super administración para gestionar usuarios, pagos, reportes, notificaciones, correos, configuración, landing, planes y métodos de pago.

## Estado

**Implementado (base).**

## Autenticación

- `POST /api/v1/admin/login` (público): `{email,password}` → `{email,name,token}`. Solo usuarios con rol `super-admin`.
- Resto de endpoints admin: `auth:sanctum` + rol `super-admin` (middleware `role:super-admin`).

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/v1/admin/login` | Login admin |
| GET | `/api/v1/admin/overview` | KPIs y resumen |
| GET | `/api/v1/admin/payments` | Pagos paginados + summary |
| PATCH | `/api/v1/admin/payments/{payment}/review` | Aprobar/rechazar pago |
| GET | `/api/v1/admin/users` | Usuarios paginados + summary |
| GET | `/api/v1/admin/users/options` | Opciones `{id,businessName}` |
| PATCH | `/api/v1/admin/users/{user}` | Actualizar usuario |
| PATCH | `/api/v1/admin/users/{user}/subscription` | Asignar/activar suscripción |
| GET | `/api/v1/admin/reports` | Reportes/tickets paginados (read-only) |
| GET | `/api/v1/admin/notifications` | Notificaciones paginadas |
| POST | `/api/v1/admin/notifications` | Crear notificación |
| GET | `/api/v1/admin/emails` | Correos paginados |
| POST | `/api/v1/admin/emails` | Crear correo |
| GET | `/api/v1/admin/settings` | Obtener settings |
| PUT | `/api/v1/admin/settings` | Guardar settings |
| GET | `/api/v1/admin/landing` | Obtener config landing |
| PUT | `/api/v1/admin/landing` | Guardar config landing |
| GET | `/api/v1/admin/plans` | Listar planes (admin) |
| PUT | `/api/v1/admin/plans` | Reemplazar catálogo planes |
| PUT | `/api/v1/admin/payment-methods` | Reemplazar catálogo métodos pago |

## Shapes clave

- **Overview**: `{totalUsers, unpaidUsers, pendingPayments, approvedPayments, revenueUsd, openReports, planSales:[{planName,count}], recentPayments: AdminPayment[]}`
- **PaymentPage**: `{items,total,page,pageSize,summary:{pending,approved,rejected,total}}`
- **AdminPayment**: `{id,userId,userName,planId,planName,method,reference,bank,paidAt,amount,currency,status(pending|approved|rejected),proofUrl,reviewNote?,createdAt}`
- **UserPage**: `{items,total,page,pageSize,summary:{active,pending,inactive,total}}`
- **AdminUser**: `{id,name,email,businessName,businessType,planId,planName,subscriptionStatus,joinedAt,lastPaymentAt,openReports}`
- **ReportPage**: `{items,total,page,pageSize,summary:{total,open,resolved,web,desktop}}`
- **NotificationPage/EmailPage**: `{items,total,page,pageSize}`
- **AdminSettings**: `{companyName,contactEmail,phone,address,loginPath}`

## Filtros/paginación

- `page`, `pageSize` (20|50|100), `search`.
- Payments: `status=pending|approved|rejected|all`.
- Users: `status=active|pending|expired|cancelled|all`.
- Reports: `source=web|desktop|all`, `status=open|resolved|all`.
- Notifications: `type=info|success|warning|all`, `audience`.
- Emails: `audience`.

## DB

- `admin_settings`, `admin_notifications`, `admin_emails` (migraciones nuevas).
- Reportes admin mapean `support_tickets`.
- Reutiliza `plans`, `payment_methods`, `landing_configs`, `payments`, `subscriptions`, `users`.

## Archivos clave

- Controllers: `app/Http/Controllers/Api/V1/Admin/*`
- Services: `app/Services/Admin/*`, `PlanService`, `PaymentMethodService`, `LandingConfigService`
- Requests: `app/Http/Requests/Api/V1/Admin/*`
- Routes: `routes/api.php` grupo `v1/admin`
- Seed: `RolePermissionSeeder` crea rol `super-admin` y admin por defecto.
- Tests: `tests/Feature/Api/V1/AdminPanelTest.php`

## Notas

- `PATCH /billing/payments/{id}/review` existente sigue siendo owner-scoped para flujo cliente; admin usa `/admin/payments/{id}/review`.
- Status pago DB `pending_review` se expone como `pending` en admin.
