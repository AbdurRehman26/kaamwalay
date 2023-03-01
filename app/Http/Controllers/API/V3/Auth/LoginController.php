<?php

namespace App\Http\Controllers\API\V3\Auth;

use App\Http\Controllers\API\V2\Auth\LoginController as V2LoginController;
use App\Http\Resources\API\V3\Customer\User\UserResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends V2LoginController
{
    public function me(): JsonResponse
    {
        return new JsonResponse([
            'data' => [
                'user' => new UserResource(auth()->user()),
            ],
        ], Response::HTTP_OK);
    }
}
