<?php

namespace Tests\Feature\Api\V1;

use App\Events\UserNotificationCreated;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Event;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationBroadcastTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_creating_global_notification_broadcasts_to_global_private_channel(): void
    {
        Event::fake([UserNotificationCreated::class]);
        $admin = User::query()->where('email', 'admin@novuspos.com')->firstOrFail();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/v1/admin/notifications', [
            'title' => 'Aviso global',
            'description' => 'Novedades para todos',
            'link' => '/panel',
            'linkLabel' => 'Ir al panel',
            'icon' => 'campaign',
            'type' => 'info',
            'audience' => 'all',
            'audienceLabel' => 'Todos los usuarios',
        ]);

        $response->assertCreated();
        Event::assertDispatched(UserNotificationCreated::class, function (UserNotificationCreated $event): bool {
            $channel = $event->broadcastOn()[0] ?? null;

            return $channel?->name === 'private-notifications.all';
        });
    }

    public function test_private_notification_channel_only_allows_its_owner(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $callback = Broadcast::getChannels()->get('notifications.{id}');
        $handler = is_array($callback) ? ($callback['callback'] ?? null) : $callback;

        $this->assertIsCallable($handler);
        $this->assertTrue($handler($user, (string) $user->id));
        $this->assertFalse($handler($user, (string) $other->id));
    }

    public function test_global_notification_channel_allows_any_authenticated_user(): void
    {
        $user = User::factory()->create();

        $callback = Broadcast::getChannels()->get('notifications.all');
        $handler = is_array($callback) ? ($callback['callback'] ?? null) : $callback;

        $this->assertIsCallable($handler);
        $this->assertTrue($handler($user));
    }

    public function test_creating_targeted_notification_broadcasts_to_user_private_channel(): void
    {
        Event::fake([UserNotificationCreated::class]);
        $admin = User::query()->where('email', 'admin@novuspos.com')->firstOrFail();
        $user = User::factory()->create();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/v1/admin/notifications', [
            'title' => 'Aviso dirigido',
            'description' => 'Solo para ti',
            'icon' => 'campaign',
            'type' => 'success',
            'audience' => (string) $user->id,
            'audienceLabel' => $user->name,
        ]);

        $response->assertCreated();
        Event::assertDispatched(UserNotificationCreated::class, function (UserNotificationCreated $event) use ($user): bool {
            $channel = $event->broadcastOn()[0] ?? null;

            return $channel?->name === 'private-notifications.'.$user->id;
        });
    }
}
