<?php

namespace App\Exceptions\Services;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SomeCardsDontExistException extends Exception
{
    /**
     * @var string
     */
    protected $message = 'Some card ids introduced don\'t exist in the system.';

    /**
     * @var int
     */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    /**
     * @param Request|array $request
     * @return JsonResponse
     */
    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
