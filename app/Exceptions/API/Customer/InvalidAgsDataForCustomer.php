<?php

namespace App\Exceptions\API\Customer;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class InvalidAgsDataForCustomer extends Exception
{
    protected $message = 'The data provided is invalid.';
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    public function render($request): JsonResponse
    {
        return new JsonResponse(['error' => $this->message], $this->code);
    }
}
