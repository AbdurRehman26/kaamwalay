<?php

namespace App\Exceptions\API\Customer\Order;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class NotSupportedPaymentNetwork extends Exception
{
    protected $message = 'This network is not supported.';
    protected $code = Response::HTTP_BAD_REQUEST;

    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
