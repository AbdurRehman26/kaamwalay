<?php

namespace App\Http\Controllers\API\V1\Customer\Wallet;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\Customer\Wallet\WalletPaymentCollection;
use App\Services\Wallet\WalletService;

class WalletController extends Controller
{
    public function __construct(private WalletService $walletService)
    {
    }

    public function payments(): WalletPaymentCollection
    {
        return new WalletPaymentCollection($this->walletService->getWalletPayments());
    }
}
