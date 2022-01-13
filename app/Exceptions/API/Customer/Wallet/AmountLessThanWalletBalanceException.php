<?php

namespace App\Exceptions\API\Customer\Wallet;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AmountLessThanWalletBalanceException extends Exception
{
    /**
     * @var string
     */
    protected $message = 'Entered amount is less than your wallet balance.';

    /**
     * @var int
     */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    /**
     * @param  Request  $request
     * @return JsonResponse
     */
    public function render(Request $request): JsonResponse
    {
        return new JsonResponse(['error' => $this->message], $this->code);
    }
}
