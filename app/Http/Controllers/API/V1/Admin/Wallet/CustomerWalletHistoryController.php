<?php

namespace App\Http\Controllers\API\V1\Admin\Wallet;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\Admin\Wallet\WalletTransactionCollection;
use App\Models\Wallet;
use Illuminate\Http\Request;

class CustomerWalletHistoryController extends Controller
{
    public function __invoke(Wallet $wallet): WalletTransactionCollection
    {
        return new WalletTransactionCollection($wallet->walletTransactions);
    }
}
