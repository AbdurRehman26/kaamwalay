<?php

namespace App\Http\Controllers\API\V1\Customer\Wallet;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\Customer\Wallet\WalletPaymentCollection;
use App\Http\Resources\API\V1\Customer\Wallet\WalletResource;
use App\Models\User;
use App\Services\Wallet\WalletService;

class WalletController extends Controller
{
    public function __construct(private WalletService $walletService)
    {
    }

    public function myWallet(): WalletResource
    {
        /* @var User */
        $user = auth()->user();
        return new WalletResource($user->wallet);
    }

    public function getPayments(): WalletPaymentCollection
    {
        return new WalletPaymentCollection($this->walletService->getWalletPayments());
    }
}
