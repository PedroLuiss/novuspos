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
| POST | `/api/v1/admin/payments` | Registrar pago manual para un usuario (puede activar suscripción) |
| PATCH | `/api/v1/admin/payments/{payment}/review` | Aprobar/rechazar pago |
| GET | `/api/v1/admin/users` | Usuarios paginados + summary |
| POST | `/api/v1/admin/users` | Crear usuario cliente desde el panel admin |
| GET | `/api/v1/admin/users/options` | Opciones ligeras `{id,businessName,name,email}`. Filtro: `withoutActiveSubscription=1` para excluir usuarios con suscripción activa |
| PATCH | `/api/v1/admin/users/{user}` | Actualizar usuario |
| PATCH | `/api/v1/admin/users/{user}/subscription` | Asignar/activar suscripción |
| GET | `/api/v1/admin/reports` | Reportes/tickets paginados (read-only) |
| GET | `/api/v1/admin/notifications` | Notificaciones paginadas |
| POST | `/api/v1/admin/notifications` | Crear notificación; emite `UserNotificationCreated` por WebSocket a los canales `private-notifications.all` o `private-notifications.{userId}` |
| GET | `/api/v1/admin/emails` | Correos paginados |
| POST | `/api/v1/admin/emails` | Crear correo |
| GET | `/api/v1/admin/settings` | Obtener settings |
| PUT | `/api/v1/admin/settings` | Guardar settings |
| GET | `/api/v1/admin/landing` | Obtener config landing |
| PUT | `/api/v1/admin/landing` | Guardar config landing |
| GET | `/api/v1/admin/plans` | Listar planes (admin) |
| PUT | `/api/v1/admin/plans` | Reemplazar catálogo planes |
| PUT | `/api/v1/admin/payment-methods` | Reemplazar catálogo métodos pago |
| GET | `/api/v1/admin/profile` | Perfil del super admin |
| PUT | `/api/v1/admin/profile` | Actualizar perfil admin |
| PUT | `/api/v1/admin/profile/password` | Cambiar contraseña admin (8-20, sin contraseña actual) |

## Shapes clave

- **Overview**: `{totalUsers, unpaidUsers, pendingPayments, approvedPayments, revenueUsd, openReports, planSales:[{planName,count}], recentPayments: AdminPayment[]}`
- **PaymentPage**: `{items,total,page,pageSize,summary:{pending,approved,rejected,total}}`
- **AdminPayment**: `{id,userId,userName,planId,planName,method,reference,bank,paidAt,amount,currency,status(pending|approved|rejected),proofUrl,reviewNote?,createdAt}`
- **CreatePayment payload**: `{userId,planId,amount?,currency?,method,reference,bank?,paidAt,status(approved|pending),note?,proofDataUrl?}`. Si `status=approved`, crea/actualiza suscripción activa.
- **UserPage**: `{items,total,page,pageSize,summary:{active,pending,inactive,total}}`
- **AdminUser**: `{id,name,email,businessName,businessType,planId,planName,subscriptionStatus,joinedAt,lastPaymentAt,openReports}`
- **CreateUser payload**: `{name,email,password,businessName,businessType?}`. Crea usuario con rol `client`.
- **ReportPage**: `{items,total,page,pageSize,summary:{total,open,resolved,web,desktop}}`
- **NotificationPage/EmailPage**: `{items,total,page,pageSize}`
- **AdminSettings**: `{companyName,contactEmail,phone,address,loginPath}`
- **AdminProfile**: `{name,email}`; password: `{password,passwordConfirmation}` (8-20).

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

- La evaluación manual del comprobante es **solo del super admin** mediante `/admin/payments/{id}/review`. El endpoint del cliente para aprobar/rechazar sus propios pagos fue eliminado: el panel del usuario solo muestra el estado `pending_review` y la nota de revisión.
- Las notificaciones creadas aquí llegan al panel del cliente en tiempo real; ver [modules/panel.md](panel.md) y la sección de broadcasting.
- Status pago DB `pending_review` se expone como `pending` en admin.
