<?php

namespace App\Events\Wallet;

use Spatie\EventSourcing\StoredEvents\ShouldBeStored;

class WalletCreated extends ShouldBeStored
{
    public function __construct(public array $attributes)
    {
    }
}
