<?php

namespace App\Exceptions\API\Auth;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class AgsAuthenticationException extends Exception
{
    protected $message = 'Please enter your AGS password.';
    protected $code = Response::HTTP_BAD_REQUEST;

    public function render($request): JsonResponse
    {
        return new JsonResponse(['error' => $this->message], $this->code);
    }
}
