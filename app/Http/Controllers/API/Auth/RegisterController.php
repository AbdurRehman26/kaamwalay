<?php

namespace App\Http\Controllers\API\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Auth\RegisterRequest;
use App\Http\Resources\API\Customer\User\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class RegisterController extends Controller
{
    public function register(RegisterRequest $request)
    {
        event(
            new CustomerRegistered(
                $user = User::createCustomer($request->only($this->formFields()))
            )
        );

        $token = auth()->guard()->login($user);

        return new JsonResponse([
            'data' => [
                'token' => $token,
                'user' => new UserResource($user),
            ],
        ], Response::HTTP_CREATED);
    }

    public function formFields()
    {
        return [
            'last_name',
            'first_name',
            'email',
            'username',
            'phone',
            'password',
        ];
    }
}
