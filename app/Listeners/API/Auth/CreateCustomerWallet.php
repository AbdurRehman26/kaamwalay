<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\Wallet\WalletService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class CreateCustomerWallet implements ShouldQueue, ShouldBeEncrypted
{
    public function __construct(protected WalletService $walletService)
    {
    }

    public function handle(CustomerRegistered $event): void
    {
        $this->walletService->createWallet([
            'user_id' => $event->user->id,
            'balance' => 0,
        ]);
    }
}
