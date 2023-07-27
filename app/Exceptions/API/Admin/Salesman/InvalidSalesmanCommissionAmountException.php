<?php

namespace App\Exceptions\API\Admin\Salesman;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InvalidSalesmanCommissionAmountException extends Exception
{
    /** @var string */
    protected $message = 'Commission amount can not be higher than the unpaid commission.';

    /** @var int */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    /**
     * @param  Request|array  $request
     */
    public function render($request): JsonResponse
    {
        return new JsonResponse(['error' => $this->message], $this->code);
    }
}
