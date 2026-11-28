<?php

namespace Tests\Feature\Api\V1;

use App\Models\AdminNotification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PanelNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_list_notifications_with_unread_first(): void
    {
        $user = User::factory()->create();

        $olderRead = AdminNotification::query()->create([
            'title' => 'Old read',
            'description' => 'Read notification',
            'type' => 'info',
            'audience' => 'all',
            'audience_label' => 'Todos los usuarios',
        ]);
        $olderRead->forceFill(['created_at' => now()->subDays(2), 'updated_at' => now()->subDays(2)])->save();

        $newUnread = AdminNotification::query()->create([
            'title' => 'New unread',
            'description' => 'Unread notification',
            'type' => 'success',
            'audience' => 'all',
            'audience_label' => 'Todos los usuarios',
        ]);
        $newUnread->forceFill(['created_at' => now()->subDay(), 'updated_at' => now()->subDay()])->save();

        $this->actingAs($user)->postJson('/api/v1/panel/notifications/mark-read', [
            'ids' => [$olderRead->id],
        ])->assertOk();

        $response = $this->actingAs($user)->getJson('/api/v1/panel/notifications?page=1&pageSize=20');

        $response->assertOk()
            ->assertJsonPath('items.0.id', (string) $newUnread->id)
            ->assertJsonPath('items.0.isRead', false)
            ->assertJsonPath('items.1.id', (string) $olderRead->id)
            ->assertJsonPath('items.1.isRead', true)
            ->assertJsonPath('unreadCount', 1);
    }

    public function test_user_can_mark_notifications_as_read(): void
    {
        $user = User::factory()->create();

        $notification = AdminNotification::query()->create([
            'title' => 'Notice',
            'description' => 'Test',
            'type' => 'warning',
            'audience' => 'all',
            'audience_label' => 'Todos los usuarios',
        ]);

        $this->actingAs($user)->getJson('/api/v1/panel/notifications/unread-count')
            ->assertOk()
            ->assertJsonPath('unreadCount', 1);

        $this->actingAs($user)->postJson('/api/v1/panel/notifications/mark-read', [
            'ids' => [$notification->id],
        ])->assertOk()
            ->assertJsonPath('marked', 1)
            ->assertJsonPath('unreadCount', 0);
    }

    public function test_user_only_sees_global_and_own_notifications(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        AdminNotification::query()->create([
            'title' => 'Global',
            'description' => 'For all',
            'type' => 'info',
            'audience' => 'all',
            'audience_label' => 'Todos los usuarios',
        ]);

        AdminNotification::query()->create([
            'title' => 'Mine',
            'description' => 'For me',
            'type' => 'info',
            'audience' => (string) $user->id,
            'audience_label' => $user->organization_name ?: $user->name,
        ]);

        AdminNotification::query()->create([
            'title' => 'Other',
            'description' => 'Not for me',
            'type' => 'info',
            'audience' => (string) $other->id,
            'audience_label' => $other->organization_name ?: $other->name,
        ]);

        $response = $this->actingAs($user)->getJson('/api/v1/panel/notifications?page=1&pageSize=20');

        $response->assertOk();
        $titles = collect($response->json('items'))->pluck('title')->all();
        $this->assertContains('Global', $titles);
        $this->assertContains('Mine', $titles);
        $this->assertNotContains('Other', $titles);
    }
}
