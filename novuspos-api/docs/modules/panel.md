# Módulo: Panel de cliente (notificaciones)

## Propósito

Notificaciones push internas para usuarios clientes. El super admin publica avisos globales o dirigidos desde `/administracion/notificaciones`; el panel del cliente los recibe **en tiempo real vía WebSocket (Laravel Reverb)**.

## Autenticación

Todos los endpoints requieren `auth:sanctum`. La autorización de canales privados se hace en `POST /api/v1/broadcasting/auth` con el mismo token Bearer (`Broadcast::auth`).

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/panel/notifications` | Lista paginada; `page`, `pageSize` (20\|50\|100), `search`, `type`, `status=all\|unread\|read`. No leídas primero, luego por fecha. |
| GET | `/api/v1/panel/notifications/unread-count` | `{unreadCount}` |
| POST | `/api/v1/panel/notifications/mark-read` | `{ids:number[]}` o `{all:true}` → `{marked,unreadCount}` |

## WebSocket / Reverb

- Evento: `App\Events\UserNotificationCreated` (`ShouldBroadcastNow`), nombre `notification.created`. Se emite **inmediatamente**: no depende de `queue:work`.
- Canales privados:
  - `private-notifications.all` → avisos globales (cualquier usuario autenticado).
  - `private-notifications.{userId}` → avisos dirigidos (solo ese usuario).
- Configuración: `config/broadcasting.php` + `config/reverb.php`, variables `REVERB_APP_ID/KEY/SECRET`, `REVERB_HOST`, `REVERB_PORT`, `REVERB_SCHEME`.
- Servidor: `php artisan reverb:start` (por defecto `0.0.0.0:8080`).
- El front usa Laravel Echo + Pusher JS apuntando a `${VITE_API_URL}/broadcasting/auth`.

## Shapes clave

- **UserNotificationPage**: `{items,total,page,pageSize,unreadCount}`
- **UserNotification**: `{id,title,description,link,linkLabel,icon,type,audience,audienceLabel,createdAt,isRead,readAt}`

## DB

- `admin_notifications` (fuente de los avisos).
- `admin_notification_reads`: estado leído por usuario (`admin_notification_id`, `user_id`, `read_at`, unique compuesto).

## Archivos clave

- Service: `app/Services/Panel/UserNotificationService.php`
- Controller: `app/Http/Controllers/Api/V1/Panel/NotificationController.php`
- Event: `app/Events/UserNotificationCreated.php`
- Canales: `routes/channels.php`
- Tests: `tests/Feature/Api/V1/PanelNotificationTest.php`, `NotificationBroadcastTest.php`
