<?php

namespace App\Exceptions\API\Auth;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class AuthenticationException extends Exception
{
    public function render($request)
    {
        return new JsonResponse([
            'error' => 'Incorrect Email or Password',
        ], Response::HTTP_UNAUTHORIZED);
    }
}
