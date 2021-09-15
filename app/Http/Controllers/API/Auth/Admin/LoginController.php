<?php

namespace App\Http\Controllers\API\Auth\Admin;

use App\Exceptions\API\Auth\AuthenticationException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends Controller
{
    public function __invoke(LoginRequest $request): JsonResponse
    {
        /* @var User $user */
        $user = User::where('email', $request->get('email'))
            ->first();

        throw_if(is_null($user), AuthenticationException::class);

        throw_unless($user->hasRole(config('permission.roles.admin')), AuthenticationException::class);

        $token = auth()->attempt($request->validated());

        throw_if(empty($token), AuthenticationException::class);

        return new JsonResponse(
            [
                'access_token' => $token,
                'type' => 'bearer',
                'expiry' => config('jwt.ttl'),
            ],
            Response::HTTP_OK,
        );
    }
}
