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
}
