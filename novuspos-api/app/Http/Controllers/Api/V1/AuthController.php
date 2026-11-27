<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\ForgotPasswordRequest;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Http\Requests\Api\V1\Auth\ResetPasswordRequest;
use App\Http\Requests\Api\V1\Auth\UpdateProfileRequest;
use App\Models\User;
use App\Services\Auth\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService,
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        return response()->json($this->authService->login($data['email'], $data['password']));
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        return response()->json($this->authService->register($request->validated()), 201);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($this->authService->me($request->user()));
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json(['message' => 'Sesión cerrada.']);
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        return response()->json($this->authService->updateProfile($request->user(), $request->validated()));
    }

    public function sendEmailVerification(Request $request): JsonResponse
    {
        return response()->json($this->authService->sendEmailVerificationNotification($request->user()));
    }

    public function verifyEmail(Request $request, int $id, string $hash): JsonResponse|RedirectResponse
    {
        $frontendUrl = rtrim((string) config('app.frontend_url', 'http://localhost:5173'), '/');
        $redirectBase = $frontendUrl.'/auth/verificar-correo';

        if (! URL::hasValidSignature($request)) {
            return redirect()->away($redirectBase.'?status=invalid');
        }

        $user = User::query()->findOrFail($id);

        try {
            $result = $this->authService->verifyEmail($user, $hash);
        } catch (ValidationException) {
            return redirect()->away($redirectBase.'?status=invalid');
        }

        $status = $result['message'] === 'Tu correo ya está verificado.' ? 'already_verified' : 'verified';

        return redirect()->away($redirectBase.'?status='.$status);
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $this->authService->forgotPassword($request->validated('email'));

        return response()->json(['message' => 'Si el correo existe, recibirás un enlace de recuperación.']);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $data = $request->validated();

        return response()->json($this->authService->resetPassword($data['email'], $data['password'], $data['token']));
    }
}
