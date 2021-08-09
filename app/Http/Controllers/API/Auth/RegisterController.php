<?php

namespace App\Http\Controllers\API\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class RegisterController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::createCustomer($request->validated());

        CustomerRegistered::dispatch($user);

        $token = auth()->guard()->login($user);

        return new JsonResponse([
            'access_token' => $token,
            'type' => 'bearer',
            'expiry' => config('jwt.ttl'),
        ], Response::HTTP_CREATED);
    }
}
