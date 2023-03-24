<?php

namespace App\Http\Controllers\API\V2\Customer\Wallet;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Customer\Wallet\WalletResource;
use App\Http\Resources\API\V2\Customer\Wallet\WalletTransactionCollection;
use App\Models\User;
use App\Services\Wallet\WalletService;

class WalletController extends Controller
{
    public function __construct(private readonly WalletService $walletService)
    {
    }

    public function getWallet(): WalletResource
    {
        /* @var User $user */
        $user = auth()->user();

        return new WalletResource($user->wallet);
    }

    public function getTransactions(): WalletTransactionCollection
    {
        return new WalletTransactionCollection($this->walletService->getWalletTransactions());
    }
}
