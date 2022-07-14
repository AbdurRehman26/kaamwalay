<?php

namespace App\Exceptions\API\Admin\Order;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OrderCanNotBeCanceled extends Exception
{
    /** @var string */
    protected $message = 'Order can not be canceled because its already being paid.';

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
