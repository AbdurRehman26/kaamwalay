<?php

namespace App\Exceptions\API\Customer\Order;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class NotSupportedPaymentNetwork extends Exception
{
    /** @var string */
    protected $message = 'This network is not supported.';

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
