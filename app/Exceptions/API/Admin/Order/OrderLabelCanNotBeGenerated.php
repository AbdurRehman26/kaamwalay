<?php

namespace App\Exceptions\API\Admin\Order;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderLabelCanNotBeGenerated extends Exception
{
    /** @var string */
    protected $message = 'Order label can only be generated for graded orders.';

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
