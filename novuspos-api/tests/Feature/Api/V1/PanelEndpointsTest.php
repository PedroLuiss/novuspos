<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Database\Seeders\PaymentMethodSeeder;
use Database\Seeders\PlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PanelEndpointsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PlanSeeder::class);
        $this->seed(PaymentMethodSeeder::class);
    }

    public function test_it_lists_active_plans(): void
    {
        $response = $this->getJson('/api/v1/billing/plans');

        $response->assertOk()
            ->assertJsonPath('plans.0.id', 'novus-mensual')
            ->assertJsonPath('plans.1.id', 'novus-anual');
    }

    public function test_it_lists_active_payment_methods(): void
    {
        $response = $this->getJson('/api/v1/billing/payment-methods');

        $response->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.id', 'mobile');
    }

    public function test_it_returns_dashboard_overview_for_authenticated_user(): void
    {
        Sanctum::actingAs(User::factory()->create(['organization_name' => 'Mi Negocio']));

        $response = $this->getJson('/api/v1/panel/overview');

        $response->assertOk()
            ->assertJsonPath('organizationName', 'Mi Negocio')
            ->assertJsonPath('planName', 'NovusPOS Mensual')
            ->assertJsonStructure(['subscriptionStatus', 'dueAt', 'activationKey', 'activationKeyRenewsAt', 'lastBackupAt']);
    }

    public function test_it_returns_subscription_overview_and_can_submit_payment(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $overview = $this->getJson('/api/v1/billing/subscription');
        $overview->assertOk()->assertJsonStructure(['plans', 'subscription', 'payments']);

        $subscriptionId = $overview->json('subscription.id');

        $submit = $this->postJson('/api/v1/billing/payments', [
            'subscriptionId' => $subscriptionId,
            'planId' => 'novus-mensual',
            'method' => 'mobile',
            'reference' => '123456',
            'paidAt' => '2026-11-27',
            'bank' => 'Banco de Venezuela',
        ]);

        $submit->assertCreated()
            ->assertJsonPath('status', 'pending_review')
            ->assertJsonPath('planId', 'novus-mensual');
    }

    public function test_it_stores_and_returns_latest_backup(): void
    {
        Storage::fake('local');
        Sanctum::actingAs(User::factory()->create());

        $file = UploadedFile::fake()->create('backup.sqlite', 100, 'application/octet-stream');

        $store = $this->post('/api/v1/backups', [
            'database' => $file,
            'created_at' => '2026-11-27T10:00:00Z',
            'sha256' => 'abc123',
            'source' => 'novuspos-desktop',
        ]);

        $store->assertCreated()->assertJsonPath('source', 'novuspos-desktop');

        $latest = $this->getJson('/api/v1/backups/latest');
        $latest->assertOk()->assertJsonPath('id', $store->json('id'));
    }

    public function test_it_submits_support_ticket(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/v1/support/tickets', [
            'email' => 'test@example.com',
            'topic' => 'ventas',
            'subject' => 'Ayuda',
            'description' => 'Necesito ayuda con ventas.',
            'source' => 'web',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['id', 'reference', 'message']);
    }
}
