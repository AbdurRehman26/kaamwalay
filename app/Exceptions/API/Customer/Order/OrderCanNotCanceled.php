<?php

namespace App\Exceptions\API\Customer\Order;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderCanNotCanceled extends Exception
{
    /** @var string */
    protected $message = 'Order can not be canceled.';

    /** @var int */
    protected $code = Response::HTTP_FORBIDDEN;

    /**
     * @param Request|array $request
     */
    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
