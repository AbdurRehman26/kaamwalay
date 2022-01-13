<?php

namespace App\Exceptions\Services\Payment;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TransactionHashIsAlreadyInUse extends Exception
{
    /** @var string */
    protected $message = 'This transaction number has already been used.';

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
