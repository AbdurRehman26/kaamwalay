<?php

namespace App\Exceptions\API\Salesman\Customer;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomerDetailsCanNotBeUpdated extends Exception
{
    /** @var string */
    protected $message = 'Customer details can not be updated due to an error occurred with AGS client.';

    /** @var int */
    protected $code = Response::HTTP_INTERNAL_SERVER_ERROR;

    /**
     * @param Request|array $request
     */
    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
