<?php

namespace App\Exceptions\API\Customer\Wallet;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WalletBalanceGreaterThanOrderTotalException extends Exception
{
    /**
     * @var string
     */
    protected $message = 'Entered amount must be equal or less than order amount.';

    /**
     * @var int
     */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    public function render(Request $request): JsonResponse
    {
        return new JsonResponse(['error' => $this->message], $this->code);
    }
}
