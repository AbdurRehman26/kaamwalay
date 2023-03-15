<?php

namespace App\Exceptions\API\Admin\Customer;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SalesmanCanNotBeAssigned extends Exception
{
    /**
     * @var string
     */
    protected $message = 'Salesman can not be assigned to this user.';
    /**
     * @var int
     */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    /**
     * @param Request|array $request
     */
    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
