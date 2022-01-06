<?php

namespace App\Http\Controllers\API\V1\Admin\Wallet;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\Admin\Wallet\WalletResource;
use App\Models\Wallet;
use Illuminate\Http\Request;

class GetCustomerWalletController extends Controller
{
    public function __invoke(Wallet $wallet): WalletResource
    {
        return new WalletResource($wallet);
    }
}
