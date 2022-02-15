<?php

namespace App\Events\Wallet;

use App\Enums\Wallet\WalletTransactionReason;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class TransactionHappened extends ShouldBeStored
{
    public function __construct(
        public int $walletId,
        public float $amount,
        public WalletTransactionReason $reason,
        public int $userId,
        public ?int $orderId
    ) {
    }
}
