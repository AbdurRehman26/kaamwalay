<?php

namespace App\Http\Controllers\API\V2\Auth;

use App\Http\Controllers\API\V1\Auth\LoginController as V1LoginController;
use App\Http\Resources\API\V2\Customer\User\UserResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class LoginController extends V1LoginController
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
