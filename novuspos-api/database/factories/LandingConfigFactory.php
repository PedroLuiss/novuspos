<?php

namespace Database\Factories;

use App\Models\LandingConfig;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LandingConfig>
 */
class LandingConfigFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $path = database_path('data/landing-defaults.json');
        $config = file_exists($path)
            ? json_decode((string) file_get_contents($path), true)
            : [];

        return [
            'config' => is_array($config) ? $config : [],
        ];
    }
}
