<?php

namespace App\Services\Backup;

use App\Contracts\Repositories\BackupRepositoryInterface;
use App\Models\Backup;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class BackupService
{
    public function __construct(
        private readonly BackupRepositoryInterface $backupRepository,
    ) {}

    /**
     * @return array<string, mixed>|null
     */
    public function latestForUser(int $userId): ?array
    {
        $backup = $this->backupRepository->latestForUser($userId);

        return $backup ? $this->toArray($backup) : null;
    }

    /**
     * @return array<string, mixed>
     */
    public function storeForUser(int $userId, UploadedFile $file, string $createdAt, ?string $checksum, ?string $source): array
    {
        $previous = $this->backupRepository->latestForUser($userId);
        if ($previous && $previous->file_path) {
            Storage::disk('local')->delete($previous->file_path);
        }
        $this->backupRepository->deleteForUser($userId);

        $path = $file->store("backups/{$userId}", 'local');

        $backup = $this->backupRepository->create([
            'user_id' => $userId,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'size_bytes' => $file->getSize(),
            'checksum' => $checksum,
            'source' => $source ?? 'novuspos-desktop',
            'backup_created_at' => $createdAt,
        ]);

        return $this->toArray($backup);
    }

    /**
     * @return array<string, mixed>
     */
    private function toArray(Backup $backup): array
    {
        return [
            'id' => (string) $backup->id,
            'createdAt' => $backup->backup_created_at?->toISOString() ?? $backup->created_at?->toISOString(),
            'sizeBytes' => $backup->size_bytes,
            'source' => $backup->source,
        ];
    }
}
