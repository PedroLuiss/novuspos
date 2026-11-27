<?php

namespace App\Services\Landing;

use App\Contracts\Repositories\LandingConfigRepositoryInterface;
use App\Support\LandingDefaults;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LandingConfigService
{
    private const DOWNLOAD_DIR = 'landing';

    private const DOWNLOAD_NAME = 'novuspos-desktop-setup.exe';

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

    /**
     * @return array<string, mixed>
     */
    public function uploadDownload(UploadedFile $file, ?string $version = null): array
    {
        Storage::disk('public')->makeDirectory(self::DOWNLOAD_DIR);
        Storage::disk('public')->putFileAs(self::DOWNLOAD_DIR, $file, self::DOWNLOAD_NAME);

        $config = $this->getAdminConfig();
        unset($config['updatedAt']);

        $download = [
            'url' => url('/api/v1/landing/download'),
            'fileName' => $file->getClientOriginalName() ?: self::DOWNLOAD_NAME,
            'sizeBytes' => $file->getSize() ?: 0,
            'updatedAt' => now()->toISOString(),
        ];

        $version = is_string($version) ? trim($version) : '';
        if ($version !== '') {
            $download['version'] = $version;
        }

        $config['download'] = $download;
        $this->save($config);

        return $download;
    }

    /**
     * @return array<string, mixed>
     */
    public function deleteDownload(): array
    {
        Storage::disk('public')->delete(self::DOWNLOAD_DIR.'/'.self::DOWNLOAD_NAME);

        $config = $this->getAdminConfig();
        unset($config['updatedAt']);
        $config['download'] = null;
        $this->save($config);

        return ['download' => null];
    }

    public function downloadResponse(): StreamedResponse
    {
        $path = self::DOWNLOAD_DIR.'/'.self::DOWNLOAD_NAME;

        abort_unless(Storage::disk('public')->exists($path), 404, 'No hay instalador disponible.');

        $config = $this->getAdminConfig();
        $download = is_array($config['download'] ?? null) ? $config['download'] : [];
        $fileName = is_string($download['fileName'] ?? null) && $download['fileName'] !== ''
            ? $download['fileName']
            : self::DOWNLOAD_NAME;

        return Storage::disk('public')->download($path, $fileName, [
            'Content-Type' => 'application/vnd.microsoft.portable-executable',
        ]);
    }
}
