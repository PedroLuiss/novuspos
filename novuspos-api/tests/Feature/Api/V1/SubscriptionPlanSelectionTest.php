<?php

namespace Tests\Feature\Api\V1;

use App\Models\Subscription;
use App\Models\User;
use Database\Seeders\PlanSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SubscriptionPlanSelectionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(PlanSeeder::class);
    }

    public function test_trial_user_can_choose_and_pay_any_plan(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $overview = $this->getJson('/api/v1/billing/subscription')->assertOk();

        $overview->assertJsonPath('subscription.isTrial', true)
            ->assertJsonPath('subscription.planId', 'novus-mensual');

        $response = $this->postJson('/api/v1/billing/payments', $this->paymentPayload($overview->json('subscription.id'), 'novus-anual', '100001'));

        $response->assertCreated()->assertJsonPath('status', 'pending_review');
        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'plan_slug' => 'novus-anual',
            'status' => 'pending_review',
        ]);
    }

    public function test_other_plans_are_blocked_while_payment_is_under_review(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $overview = $this->getJson('/api/v1/billing/subscription')->assertOk();
        $subscriptionId = $overview->json('subscription.id');

        $this->postJson('/api/v1/billing/payments', $this->paymentPayload($subscriptionId, 'novus-anual', '100002'))
            ->assertCreated();

        $this->postJson('/api/v1/billing/payments', $this->paymentPayload($subscriptionId, 'novus-mensual', '100003'))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['planId']);
    }

    public function test_user_cannot_review_their_own_payment(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $subscriptionId = $this->getJson('/api/v1/billing/subscription')->assertOk()->json('subscription.id');
        $payment = $this->postJson('/api/v1/billing/payments', $this->paymentPayload($subscriptionId, 'novus-anual', '100007'))
            ->assertCreated()
            ->json('id');

        $this->patchJson("/api/v1/billing/payments/{$payment}/review", ['approved' => true])
            ->assertNotFound();

        $this->assertDatabaseHas('payments', [
            'id' => $payment,
            'status' => 'pending_review',
        ]);
    }

    public function test_after_approval_only_current_plan_can_be_renewed_until_expiry(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $overview = $this->getJson('/api/v1/billing/subscription')->assertOk();
        $subscriptionId = $overview->json('subscription.id');

        $payment = $this->postJson('/api/v1/billing/payments', $this->paymentPayload($subscriptionId, 'novus-anual', '100004'))
            ->assertCreated()
            ->json('id');

        // Solo el super admin evalúa y aprueba el comprobante.
        $admin = User::query()->where('email', 'admin@novuspos.com')->firstOrFail();
        Sanctum::actingAs($admin);
        $this->patchJson("/api/v1/admin/payments/{$payment}/review", ['approved' => true, 'note' => 'Transferencia verificada'])
            ->assertOk()
            ->assertJsonPath('status', 'approved');
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/billing/subscription')
            ->assertOk()
            ->assertJsonPath('subscription.planId', 'novus-anual')
            ->assertJsonPath('subscription.status', 'active')
            ->assertJsonPath('subscription.isTrial', false);

        // Ni siquiera el plan vigente se puede volver a pagar mientras siga activo.
        $this->postJson('/api/v1/billing/payments', $this->paymentPayload($subscriptionId, 'novus-anual', '100005'))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['planId']);

        Subscription::query()->where('user_id', $user->id)->update([
            'renews_at' => now()->subDay()->toDateString(),
        ]);

        $this->getJson('/api/v1/billing/subscription')
            ->assertOk()
            ->assertJsonPath('subscription.isTrial', false);

        $this->postJson('/api/v1/billing/payments', $this->paymentPayload($subscriptionId, 'novus-mensual', '100006'))
            ->assertCreated();

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'plan_slug' => 'novus-mensual',
            'status' => 'pending_review',
        ]);
    }

    /**
     * @return array<string, string>
     */
    private function paymentPayload(string $subscriptionId, string $planId, string $reference): array
    {
        return [
            'subscriptionId' => $subscriptionId,
            'planId' => $planId,
            'method' => 'mobile',
            'reference' => $reference,
            'paidAt' => now()->toDateString(),
            'bank' => 'Banesco',
            'proofName' => 'comprobante.jpg',
            'proofDataUrl' => 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA==',
        ];
    }
}
