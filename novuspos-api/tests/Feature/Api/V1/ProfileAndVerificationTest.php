<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Database\Seeders\PaymentMethodSeeder;
use Database\Seeders\PlanSeeder;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ProfileAndVerificationTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function user_can_update_profile_without_changing_email(): void
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'organization_name' => 'Old Org',
            'business_sector' => 'Old Sector',
            'email' => 'user@example.com',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/v1/auth/profile', [
            'name' => 'New Name',
            'organization_name' => 'New Org',
            'business_sector' => 'Retail',
        ]);

        $response->assertOk()
            ->assertJsonPath('user.name', 'New Name')
            ->assertJsonPath('user.organizationName', 'New Org')
            ->assertJsonPath('user.businessSector', 'Retail')
            ->assertJsonPath('user.email', 'user@example.com');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'New Name',
            'organization_name' => 'New Org',
            'business_sector' => 'Retail',
            'email' => 'user@example.com',
        ]);
    }

    #[Test]
    public function user_can_request_email_verification_notification(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/auth/email/verification-notification');

        $response->assertOk()
            ->assertJsonPath('message', 'Te enviamos un enlace de verificación a tu correo.');

        Notification::assertSentTo($user, VerifyEmail::class);
    }

    #[Test]
    public function user_can_verify_email_with_valid_signed_link(): void
    {
        $user = User::factory()->unverified()->create();

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $response = $this->get($url);

        $response->assertRedirect();
        $this->assertStringContainsString('status=verified', $response->headers->get('Location'));
        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    #[Test]
    public function expired_subscription_requires_verified_email_to_submit_payment(): void
    {
        $this->seed(PlanSeeder::class);
        $this->seed(PaymentMethodSeeder::class);

        $user = User::factory()->unverified()->create();
        Sanctum::actingAs($user);

        $overview = $this->getJson('/api/v1/billing/subscription')->assertOk();
        $subscriptionId = $overview->json('subscription.id');

        $this->travel(31)->days();

        $response = $this->postJson('/api/v1/billing/payments', [
            'subscriptionId' => $subscriptionId,
            'planId' => 'novus-mensual',
            'method' => 'mobile',
            'reference' => '123456',
            'paidAt' => now()->toDateString(),
            'bank' => 'Banco de Venezuela',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function verified_user_can_submit_payment_after_trial_expires(): void
    {
        $this->seed(PlanSeeder::class);
        $this->seed(PaymentMethodSeeder::class);

        $user = User::factory()->create(); // verified by default
        Sanctum::actingAs($user);

        $overview = $this->getJson('/api/v1/billing/subscription')->assertOk();
        $subscriptionId = $overview->json('subscription.id');

        $this->travel(31)->days();

        $response = $this->postJson('/api/v1/billing/payments', [
            'subscriptionId' => $subscriptionId,
            'planId' => 'novus-mensual',
            'method' => 'mobile',
            'reference' => '123456',
            'paidAt' => now()->toDateString(),
            'bank' => 'Banco de Venezuela',
        ]);

        $response->assertCreated()
            ->assertJsonPath('status', 'pending_review');
    }
}
