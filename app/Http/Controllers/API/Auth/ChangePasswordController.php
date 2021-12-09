<?php

namespace App\Http\Controllers\API\Auth;

use App\Events\API\Auth\CustomerPasswordChanged;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Auth\ChangePasswordRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ChangePasswordController extends Controller
{
    public function change(ChangePasswordRequest $request): JsonResponse
    {
        $password = $request->password;

        /* @var User */
        $user = auth()->user();

        CustomerPasswordChanged::dispatch($request->only('current_password', 'password', 'password_confirmation', 'platform'));

        $this->changePassword($user, $password);

        $token = auth()->guard()->login($user);

        return new JsonResponse([
            'access_token' => $token,
            'type' => 'bearer',
            'expiry' => config('jwt.ttl'),
        ], Response::HTTP_CREATED);
    }

    protected function changePassword(User $user, string $password): void
    {
        $user->password = $password;
        $user->setRememberToken(Str::random(60));

        $user->save();
    }
}
