<?php

namespace Database\Seeders;

use App\Models\LandingConfig;
use App\Support\LandingDefaults;
use Illuminate\Database\Seeder;

class LandingConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LandingConfig::query()->firstOrCreate([], [
            'config' => LandingDefaults::config(),
        ]);
    }
}
