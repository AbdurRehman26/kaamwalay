<?php

namespace App\Exceptions\Services\Payment;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class PaymentMethodNotSupported extends Exception
{
    protected $message = 'Payment provider did not match.';
    protected $code = Response::HTTP_BAD_REQUEST;

    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
