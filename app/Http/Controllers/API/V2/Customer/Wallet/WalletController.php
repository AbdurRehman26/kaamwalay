<?php

namespace App\Http\Controllers\API\V2\Customer\Wallet;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Customer\Wallet\WalletResource;
use App\Http\Resources\API\V2\Customer\Wallet\WalletTransactionResource;
use App\Models\User;
use App\Services\Wallet\WalletService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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

    public function getTransactions(): AnonymousResourceCollection
    {
        return WalletTransactionResource::collection($this->walletService->getWalletTransactions());
    }
}
