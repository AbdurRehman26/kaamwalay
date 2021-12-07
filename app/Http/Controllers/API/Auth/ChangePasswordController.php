<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Auth\ChangePasswordRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
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

        $this->changePassword($user, $password);

        $token = auth()->guard()->login($user);

        return new JsonResponse([
            'access_token' => $token,
            'type' => 'bearer',
            'expiry' => config('jwt.ttl'),
        ], Response::HTTP_CREATED);

    }

    protected function changePassword(Authenticatable $user, string $password)
    {
        $user->password = $password;
        $user->setRememberToken(Str::random(60));

        $user->save();
    }

}

