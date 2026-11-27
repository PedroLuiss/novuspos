<?php

namespace App\Contracts\Repositories;

use App\Models\LandingConfig;

interface LandingConfigRepositoryInterface
{
    public function latest(): ?LandingConfig;

    /**
     * @param  array<string, mixed>  $config
     */
    public function save(array $config): LandingConfig;
}
