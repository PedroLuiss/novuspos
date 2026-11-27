<?php

namespace App\Repositories;

use App\Contracts\Repositories\LandingConfigRepositoryInterface;
use App\Models\LandingConfig;

class LandingConfigRepository implements LandingConfigRepositoryInterface
{
    public function latest(): ?LandingConfig
    {
        return LandingConfig::query()->latest('id')->first();
    }

    public function save(array $config): LandingConfig
    {
        $landingConfig = $this->latest();

        if ($landingConfig) {
            $landingConfig->update(['config' => $config]);

            return $landingConfig->fresh();
        }

        return LandingConfig::query()->create(['config' => $config]);
    }
}
