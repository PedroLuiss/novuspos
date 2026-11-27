<?php

namespace App\Services\Auth;

use App\Contracts\Repositories\UserRepositoryInterface;
use App\Http\Resources\Api\V1\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    /**
     * @return array{token: string, user: array<string, mixed>}
     */
    public function login(string $email, string $password): array
    {
        $user = $this->userRepository->findByEmail($email);

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales no son válidas.'],
            ]);
        }

        return $this->tokenResponse($user);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array{token: string, user: array<string, mixed>}
     */
    public function register(array $data): array
    {
        $organization = $data['organization_name'] ?? $data['business'] ?? $data['name'] ?? null;
        $sector = $data['business_sector'] ?? $data['sector'] ?? null;

        $user = $this->userRepository->create([
            'name' => $data['name'],
            'organization_name' => is_string($organization) ? $organization : null,
            'business_sector' => is_string($sector) ? $sector : null,
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        return $this->tokenResponse($user);
    }

    /**
     * @return array{user: array<string, mixed>}
     */
    public function me(User $user): array
    {
        return ['user' => (new UserResource($user))->resolve()];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    public function forgotPassword(string $email): void
    {
        Password::sendResetLink(['email' => $email]);
    }

    /**
     * @return array{token: string, user: array<string, mixed>}
     */
    public function resetPassword(string $email, string $password, string $token): array
    {
        $status = Password::reset(
            ['email' => $email, 'password' => $password, 'token' => $token],
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            },
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        $user = $this->userRepository->findByEmail($email);

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['No se pudo restablecer la contraseña.'],
            ]);
        }

        $user->tokens()->delete();

        return $this->tokenResponse($user);
    }

    /**
     * @return array{token: string, user: array<string, mixed>}
     */
    private function tokenResponse(User $user): array
    {
        $token = $user->createToken('novuspos-web')->plainTextToken;

        return [
            'token' => $token,
            'user' => (new UserResource($user))->resolve(),
        ];
    }
}
