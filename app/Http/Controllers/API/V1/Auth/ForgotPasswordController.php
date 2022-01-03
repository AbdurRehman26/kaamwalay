<?php

namespace App\Http\Controllers\API\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Auth\ForgotPasswordRequest;
use Illuminate\Contracts\Auth\PasswordBroker;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    public function sendResetLinkEmail(ForgotPasswordRequest $request): JsonResponse
    {
        $this->broker()->sendResetLink(
            $request->only('email')
        );

        return new JsonResponse([
            'message' => 'We sent you details, check your email and follow the link to reset your password.',
        ]);
    }

    public function broker(): PasswordBroker
    {
        return Password::broker();
    }
}
