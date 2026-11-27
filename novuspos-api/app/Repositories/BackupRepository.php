<?php

namespace App\Repositories;

use App\Contracts\Repositories\BackupRepositoryInterface;
use App\Models\Backup;

class BackupRepository implements BackupRepositoryInterface
{
    public function latestForUser(int $userId): ?Backup
    {
        return Backup::query()->where('user_id', $userId)->latest('id')->first();
    }

    public function create(array $attributes): Backup
    {
        return Backup::query()->create($attributes);
    }

    public function deleteForUser(int $userId): void
    {
        Backup::query()->where('user_id', $userId)->delete();
    }
}
