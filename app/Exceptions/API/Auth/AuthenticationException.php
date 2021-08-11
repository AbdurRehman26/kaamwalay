<?php

namespace App\Exceptions\API\Auth;

use Exception;
use Illuminate\Http\JsonResponse;

class AuthenticationException extends Exception
{
    public function render($request)
    {
        return new JsonResponse([
            'error' => 'Incorrect Email or Password',
        ]);
    }
}
