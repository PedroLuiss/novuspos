<?php

namespace App\Contracts\Repositories;

use App\Models\LandingConfig;

interface LandingConfigRepositoryInterface
{
    public function latest(): ?LandingConfig;
}
