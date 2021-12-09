<?php

namespace App\Exceptions\API\Auth;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AgsAuthenticationException extends Exception
{
    /**
     * @var string
     */
    protected $message = 'Please enter your AGS password.';
    /**
     * @var int
     */
    protected $code = Response::HTTP_BAD_REQUEST;

    /**
     * @param Request|array $request
     * @return JsonResponse
     */
    public function render($request): JsonResponse
    {
        return new JsonResponse(['error' => $this->message], $this->code);
    }
}
