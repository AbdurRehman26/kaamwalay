<?php

namespace App\Exceptions\API\Customer\Wallet;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WalletCreditGreaterThanOrderTotalException extends Exception
{
    /**
     * @var string
     */
    protected $message = 'You do not have the entered amount in your wallet.';

    /**
     * @var int
     */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    public function render(Request $request): JsonResponse
    {
        return new JsonResponse(['error' => $this->message], $this->code);
    }
}
