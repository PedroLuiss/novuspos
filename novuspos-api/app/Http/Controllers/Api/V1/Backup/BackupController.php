<?php

namespace App\Http\Controllers\Api\V1\Backup;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Backup\StoreBackupRequest;
use App\Services\Backup\BackupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BackupController extends Controller
{
    public function __construct(
        private readonly BackupService $backupService,
    ) {}

    public function latest(Request $request): JsonResponse
    {
        $backup = $this->backupService->latestForUser($request->user()->id);

        if ($backup === null) {
            return response()->json(null);
        }

        return response()->json($backup);
    }

    public function store(StoreBackupRequest $request): JsonResponse
    {
        $backup = $this->backupService->storeForUser(
            $request->user()->id,
            $request->file('database'),
            $request->validated('created_at'),
            $request->validated('sha256'),
            $request->validated('source'),
        );

        return response()->json($backup, 201);
    }
}
