<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Admin\AdminChangePasswordRequest;
use App\Http\Requests\Api\V1\Admin\AdminUpdateProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }

    public function update(AdminUpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $emailExists = $user->newQuery()
            ->where('email', $data['email'])
            ->where('id', '!=', $user->id)
            ->exists();

        if ($emailExists) {
            throw ValidationException::withMessages(['email' => ['Este correo ya está en uso.']]);
        }

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);
        $user->save();

        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }

    public function updatePassword(AdminChangePasswordRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $user->password = $data['password'];
        $user->save();

        return response()->json([
            'message' => 'Contraseña actualizada correctamente.',
        ]);
    }
}
