<?php

namespace App\Projectors\Wallet;

use App\Events\Wallet\TransactionHappened;
use App\Events\Wallet\WalletCreated;
use App\Services\Wallet\WalletService;
use Spatie\EventSourcing\EventHandlers\Projectors\Projector;

class WalletProjector extends Projector
{
    protected array $handlesEvents = [
        WalletCreated::class => 'onWalletCreated',
        TransactionHappened::class => 'onTransactionHappened',
    ];

    public function __construct(protected WalletService $service)
    {
    }
    public function onWalletCreated(WalletCreated $event)
    {
        $this->service->createWallet($event->attributes);
    }

    public function onTransactionHappened(TransactionHappened $event)
    {
        $this->service->processTransaction(
            $event->walletId,
            $event->amount,
            $event->reason,
            $event->userId,
            $event->orderId,
        );
    }
}
