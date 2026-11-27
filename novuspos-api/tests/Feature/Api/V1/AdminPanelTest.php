<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Database\Seeders\PaymentMethodSeeder;
use Database\Seeders\PlanSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(PlanSeeder::class);
        $this->seed(PaymentMethodSeeder::class);
        $this->admin = User::query()->where('email', 'admin@novuspos.com')->firstOrFail();
    }

    #[Test]
    public function super_admin_can_login(): void
    {
        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@novuspos.com',
            'password' => 'NovusPOS123*',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['email', 'name', 'token']);
    }

    #[Test]
    public function admin_endpoints_require_super_admin_role(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/admin/overview')->assertForbidden();
    }

    #[Test]
    public function super_admin_can_access_overview_and_lists(): void
    {
        Sanctum::actingAs($this->admin);

        $this->getJson('/api/v1/admin/overview')->assertOk()
            ->assertJsonStructure(['totalUsers', 'unpaidUsers', 'pendingPayments', 'approvedPayments', 'revenueUsd', 'openReports', 'planSales', 'recentPayments']);

        $this->getJson('/api/v1/admin/payments')->assertOk()
            ->assertJsonStructure(['items', 'total', 'page', 'pageSize', 'summary']);

        $this->getJson('/api/v1/admin/users')->assertOk()
            ->assertJsonStructure(['items', 'total', 'page', 'pageSize', 'summary']);

        $this->getJson('/api/v1/admin/users/options')->assertOk();

        $this->getJson('/api/v1/admin/reports')->assertOk()
            ->assertJsonStructure(['items', 'total', 'page', 'pageSize', 'summary']);

        $this->getJson('/api/v1/admin/notifications')->assertOk()
            ->assertJsonStructure(['items', 'total', 'page', 'pageSize']);

        $this->getJson('/api/v1/admin/emails')->assertOk()
            ->assertJsonStructure(['items', 'total', 'page', 'pageSize']);

        $this->getJson('/api/v1/admin/settings')->assertOk()
            ->assertJsonStructure(['companyName', 'contactEmail', 'phone', 'address', 'loginPath']);

        $this->getJson('/api/v1/admin/landing')->assertOk();

        $this->getJson('/api/v1/admin/plans')->assertOk();
    }

    #[Test]
    public function super_admin_can_create_notification_and_email(): void
    {
        Sanctum::actingAs($this->admin);

        $notif = $this->postJson('/api/v1/admin/notifications', [
            'title' => 'Test',
            'description' => 'Desc',
            'link' => '/panel',
            'icon' => 'campaign',
            'type' => 'info',
            'audience' => 'all',
            'audienceLabel' => 'Todos los usuarios',
        ]);

        $notif->assertCreated()->assertJsonPath('title', 'Test');

        $email = $this->postJson('/api/v1/admin/emails', [
            'subject' => 'Hola',
            'body' => '<p>Hola</p>',
            'bodyText' => 'Hola',
            'audience' => 'all',
            'audienceLabel' => 'Todos los usuarios',
        ]);

        $email->assertCreated()->assertJsonPath('subject', 'Hola');
    }

    #[Test]
    public function super_admin_can_save_settings_landing_plans_and_payment_methods(): void
    {
        Sanctum::actingAs($this->admin);

        $this->putJson('/api/v1/admin/settings', [
            'companyName' => 'NovusPOS',
            'contactEmail' => 'a@b.com',
            'phone' => '123',
            'address' => 'Dir',
            'loginPath' => '/acceso-maestro',
        ])->assertOk()->assertJsonPath('companyName', 'NovusPOS');

        $this->putJson('/api/v1/admin/landing', [
            'config' => ['theme' => ['primary' => '#000000']],
        ])->assertOk();

        $this->putJson('/api/v1/admin/plans', [
            'plans' => [
                [
                    'id' => 'test-plan',
                    'name' => 'Test Plan',
                    'description' => 'Desc',
                    'price' => 9.99,
                    'currency' => 'USD',
                    'interval' => 'month',
                    'features' => ['A'],
                    'highlighted' => false,
                    'active' => true,
                ],
            ],
        ])->assertOk()->assertJsonCount(1);

        $this->putJson('/api/v1/admin/payment-methods', [
            'methods' => [
                [
                    'id' => 'bank',
                    'label' => 'Banco',
                    'description' => 'Desc',
                    'icon' => 'account_balance',
                    'active' => true,
                    'rows' => [['label' => 'Cuenta', 'value' => '123', 'mono' => true]],
                ],
            ],
        ])->assertOk()->assertJsonCount(1);
    }

    #[Test]
    public function super_admin_can_update_profile_and_password_with_rules(): void
    {
        Sanctum::actingAs($this->admin);

        $this->getJson('/api/v1/admin/profile')
            ->assertOk()
            ->assertJsonPath('email', 'admin@novuspos.com');

        $this->putJson('/api/v1/admin/profile', [
            'name' => 'Admin Nuevo',
            'email' => 'admin2@novuspos.com',
        ])->assertOk()
            ->assertJsonPath('name', 'Admin Nuevo')
            ->assertJsonPath('email', 'admin2@novuspos.com');

        $this->putJson('/api/v1/admin/profile/password', [
            'password' => 'Abc@1234',
            'passwordConfirmation' => 'Abc@1234',
        ])->assertOk()
            ->assertJsonPath('message', 'Contraseña actualizada correctamente.');

        $this->putJson('/api/v1/admin/profile/password', [
            'password' => 'short1!',
            'passwordConfirmation' => 'short1!',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);

        $this->putJson('/api/v1/admin/profile/password', [
            'password' => 'ThisPasswordIsWayTooLong!',
            'passwordConfirmation' => 'ThisPasswordIsWayTooLong!',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['password']);
    }
}
