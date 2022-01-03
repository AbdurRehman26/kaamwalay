<?php

namespace App\Events\Wallet;

use App\Models\Wallet;
use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class TransactionHappened extends ShouldBeStored
{
    public function __construct(
        public int $walletId,
        public float $amount,
        public string $reason,
        public ?int $orderId
    ) {
    }
}
