<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthService
{
    /**
     * @return array{email: string, name: string, token: string}
     */
    public function login(string $email, string $password): array
    {
        $user = User::query()->where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales no son válidas.'],
            ]);
        }

        if (! $user->hasRole('super-admin')) {
            throw ValidationException::withMessages([
                'email' => ['No tienes acceso al panel de administración.'],
            ]);
        }

        $token = $user->createToken('novuspos-admin')->plainTextToken;

        return [
            'email' => $user->email,
            'name' => $user->name,
            'token' => $token,
        ];
    }
}
