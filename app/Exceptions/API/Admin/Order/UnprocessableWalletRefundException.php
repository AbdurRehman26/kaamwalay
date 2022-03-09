<?php

namespace App\Exceptions\API\Admin\Order;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UnprocessableWalletRefundException extends Exception
{
    /**
     * @var string
     */
    protected $message = 'Unpaid orders adjustments can not be made to user\'s wallet';
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
