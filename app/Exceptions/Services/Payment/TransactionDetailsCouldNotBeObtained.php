<?php

namespace App\Exceptions\Services\Payment;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TransactionDetailsCouldNotBeObtained extends Exception
{
    /** @var string */
    protected $message = 'Transaction details could not be obtained.';

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
