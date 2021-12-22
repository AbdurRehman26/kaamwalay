<?php

namespace App\Http\Controllers\API\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Auth\ResetPasswordRequest;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Contracts\Auth\PasswordBroker;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

use function event;
use function trans;

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

        return $response === Password::PASSWORD_RESET
            ? $this->sendResetResponse($response)
            : $this->sendResetFailedResponse($response);
    }

    protected function sendResetResponse($response): JsonResponse
    {
        return new JsonResponse(['message' => trans($response)], 200);
    }

    protected function sendResetFailedResponse($response)
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
