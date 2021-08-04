<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Auth\LoginRequest;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends Controller
{
    public function login(LoginRequest $request)
    {
        if (! ($token = auth()->attempt($request->validated()))) {
            return response()->json(
                [
                    'error' => 'Unauthorized',
                ],
                Response::HTTP_UNAUTHORIZED,
            );
        }

        return response()->json(
            [
                'access_token' => $token,
                'user' => auth()->user(),
            ],
            Response::HTTP_OK,
        );
    }
}
