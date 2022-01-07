<?php

namespace App\Events\Wallet;

use Illuminate\Foundation\Bus\Dispatchable;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class TransactionHappened extends ShouldBeStored
{
    public function __construct(
        public int $walletId,
        public float $amount,
        public string $reason,
        public int $userId,
        public ?int $orderId
    ) {
    }
}
