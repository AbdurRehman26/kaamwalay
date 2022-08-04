<?php

namespace App\Http\Controllers\API\V1\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Auth\ResetPasswordRequest;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Contracts\Auth\PasswordBroker;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ResetPasswordController extends Controller
{
    public function reset(ResetPasswordRequest $request): JsonResponse
    {
        $response = $this->broker()->reset(
            $request->only(
                'email',
                'password',
                'password_confirmation',
                'token'
            ),
            fn ($user, $password) => $this->resetPassword($user, $password)
        );

        $user = User::whereEmail($request->email)->first();
        if ($response === Password::PASSWORD_RESET && ! $user->last_login_at) {
            CustomerRegistered::dispatch($user, $request->only('password', 'platform', 'app_generated_id'));
        }

        return $response === Password::PASSWORD_RESET
            ? $this->sendResetResponse($response)
            : $this->sendResetFailedResponse($response);
    }

    protected function sendResetResponse(mixed $response): JsonResponse
    {
        return new JsonResponse(['message' => trans($response)], 200);
    }

    protected function sendResetFailedResponse(mixed $response): JsonResponse
    {
        throw ValidationException::withMessages([
            'email' => [trans($response)],
        ]);
    }

    protected function resetPassword(User $user, string $password): void
    {
        $user->password = $password;
        $user->setRememberToken(Str::random(60));

        $user->save();

        event(new PasswordReset($user));
    }

    public function broker(): PasswordBroker
    {
        return Password::broker();
    }
}
