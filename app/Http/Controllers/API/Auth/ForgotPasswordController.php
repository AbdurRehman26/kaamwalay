<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Auth\ForgotPasswordRequest;
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
            'message' => 'Successfully sent Password Reset Email',
        ]);
    }

    public function broker(): PasswordBroker
    {
        return Password::broker();
    }
}
