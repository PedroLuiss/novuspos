<?php

namespace App\Services\Landing;

use App\Contracts\Repositories\LandingConfigRepositoryInterface;
use App\Support\LandingDefaults;

class LandingConfigService
{
    public function __construct(
        private readonly LandingConfigRepositoryInterface $landingConfigRepository,
    ) {}

    /**
     * @return array{config: array<string, mixed>, updatedAt?: string}
     */
    public function getPublicConfig(): array
    {
        $landingConfig = $this->landingConfigRepository->latest();

        if ($landingConfig === null) {
            return [
                'config' => LandingDefaults::config(),
            ];
        }

        $config = is_array($landingConfig->config) ? $landingConfig->config : LandingDefaults::config();

        return [
            'config' => $config,
            'updatedAt' => $landingConfig->updated_at?->toISOString(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function getAdminConfig(): array
    {
        $landingConfig = $this->landingConfigRepository->latest();
        $config = $landingConfig && is_array($landingConfig->config)
            ? $landingConfig->config
            : LandingDefaults::config();

        if ($landingConfig?->updated_at) {
            $config['updatedAt'] = $landingConfig->updated_at->toISOString();
        }

        return $config;
    }

    /**
     * @param  array<string, mixed>  $config
     * @return array<string, mixed>
     */
    public function save(array $config): array
    {
        $landingConfig = $this->landingConfigRepository->save($config);
        $saved = is_array($landingConfig->config) ? $landingConfig->config : $config;
        $saved['updatedAt'] = $landingConfig->updated_at?->toISOString();

        return $saved;
    }
}
