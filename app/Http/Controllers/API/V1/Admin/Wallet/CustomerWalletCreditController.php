<?php

namespace App\Http\Controllers\API\V1\Admin\Wallet;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Admin\Wallet\CustomerWalletCreditRequest;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CustomerWalletCreditController extends Controller
{
    public function __invoke(CustomerWalletCreditRequest $request, Wallet $wallet): JsonResponse
    {
        $wallet->makeTransaction(
            amount: $request->input('amount'),
            reason:WalletTransaction::REASON_WALLET_CREDIT,
            userId: auth()->user()->id
        );

        return new JsonResponse(['success' => true], Response::HTTP_CREATED);
    }
}
