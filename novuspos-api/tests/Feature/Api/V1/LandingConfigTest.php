<?php

namespace Tests\Feature\Api\V1;

use App\Models\LandingConfig;
use App\Models\User;
use App\Support\LandingDefaults;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LandingConfigTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_default_landing_config_when_no_record_exists(): void
    {
        $response = $this->getJson('/api/v1/landing/config');

        $response->assertOk()
            ->assertJsonPath('config.copy.header.login', 'Iniciar Sesión')
            ->assertJsonPath('config.theme.primary', '#003ec7')
            ->assertJsonPath('config.sections.0.id', 'features')
            ->assertJsonCount(5, 'config.screenshots');
    }

    public function test_it_returns_the_latest_stored_landing_config(): void
    {
        $config = LandingDefaults::config();
        $config['copy']['hero']['headlineAccent'] = 'rápido y confiable';

        LandingConfig::query()->create([
            'config' => $config,
        ]);

        $response = $this->getJson('/api/v1/landing/config');

        $response->assertOk()
            ->assertJsonPath('config.copy.hero.headlineAccent', 'rápido y confiable')
            ->assertJsonStructure([
                'config' => ['theme', 'sections', 'screenshots', 'logos', 'copy'],
                'updatedAt',
            ]);
    }

    public function test_landing_download_requires_authentication(): void
    {
        $response = $this->getJson('/api/v1/landing/download');

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_can_download_published_installer(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('landing/novuspos-desktop-setup.exe', 'fake-installer');

        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/api/v1/landing/download');

        $response->assertOk();
        $response->assertDownload('novuspos-desktop-setup.exe');
    }
}
