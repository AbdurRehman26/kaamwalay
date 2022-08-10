<?php

namespace App\Exceptions\API\Admin\Order;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderCanNotBeMarkedAsAssembled extends Exception
{
    /** @var string */
    protected $message = 'Order can not be marked as Assembled because it is not graded yet.';

    /** @var int */
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
