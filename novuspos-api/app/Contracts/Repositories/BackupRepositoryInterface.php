<?php

namespace App\Contracts\Repositories;

use App\Models\Backup;

interface BackupRepositoryInterface
{
    public function latestForUser(int $userId): ?Backup;

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Backup;

    public function deleteForUser(int $userId): void;
}
