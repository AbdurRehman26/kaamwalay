<?php

namespace App\Http\Controllers\API\V2\Salesman\Wallet;

use App\Enums\Wallet\WalletTransactionReason;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Salesman\Wallet\CustomerWalletCreditRequest;
use App\Http\Resources\API\V2\Salesman\Wallet\WalletResource;
use App\Http\Resources\API\V2\Salesman\Wallet\WalletTransactionCollection;
use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CustomerWalletController extends Controller
{
    public function show(Wallet $wallet): WalletResource
    {
        return new WalletResource($wallet);
    }

    public function getTransactionsHistory(Wallet $wallet): WalletTransactionCollection
    {
        return new WalletTransactionCollection($wallet->walletTransactions);
    }

    public function creditToWallet(CustomerWalletCreditRequest $request, Wallet $wallet): JsonResponse
    {
        $wallet->makeTransaction(
            amount: $request->input('amount'),
            reason: WalletTransactionReason::WALLET_CREDIT,
            userId: auth()->user()->id
        );

        return new JsonResponse(['success' => true], Response::HTTP_CREATED);
    }
}
