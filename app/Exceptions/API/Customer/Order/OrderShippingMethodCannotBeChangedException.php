<?php

namespace App\Exceptions\API\Customer\Order;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderShippingMethodCannotBeChangedException extends Exception
{
    /** @var string */
    protected $message = 'Shipping method of the order can not be changed once the order is paid.';

    /** @var int */
    protected $code = Response::HTTP_FORBIDDEN;

    /**
     * @param Request|array $request
     * @return JsonResponse
     */
    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
