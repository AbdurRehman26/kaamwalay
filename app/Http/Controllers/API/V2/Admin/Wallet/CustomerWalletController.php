<?php

namespace App\Http\Controllers\API\V2\Admin\Wallet;

use App\Enums\Wallet\WalletTransactionReason;
use App\Events\API\Admin\Wallet\CustomerWalletCredited;
use App\Http\Controllers\API\V1\Admin\Wallet\CustomerWalletController as V1CustomerWalletController;
use App\Http\Requests\API\V1\Admin\Wallet\CustomerWalletCreditRequest;
use App\Models\Wallet;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CustomerWalletController extends V1CustomerWalletController
{
    //
    public function creditToWallet(CustomerWalletCreditRequest $request, Wallet $wallet): JsonResponse
    {
        try{
            $wallet->makeTransaction(
                amount: $request->input('amount'),
                reason: WalletTransactionReason::WALLET_CREDIT,
                userId: auth()->user()->id
            );

            CustomerWalletCredited::dispatch($wallet->refresh());

            return new JsonResponse(['success' => true], Response::HTTP_CREATED);

        }catch (Exception $e){
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                $e->getCode()
            );
        }
    }
}
