<?php

namespace App\Exceptions\API\Customer\Order;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IncorrectOrderPayment extends Exception
{
    /** @var string */
    protected $message = 'Order payment information is incorrect.';

    /** @var int */
    protected $code = Response::HTTP_BAD_REQUEST;

    /**
     * @param Request|array $request
     * @return JsonResponse
     */
    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
