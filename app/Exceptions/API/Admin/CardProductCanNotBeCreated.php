<?php

namespace App\Exceptions\API\Admin;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CardProductCanNotBeCreated extends Exception
{
    protected $message = 'Card can not be created due to an error occurred with AGS client.';
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
