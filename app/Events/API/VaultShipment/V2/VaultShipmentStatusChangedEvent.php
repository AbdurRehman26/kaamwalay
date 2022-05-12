<?php

namespace App\Events\API\VaultShipment\V2;

use App\Models\VaultShipment;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VaultShipmentStatusChangedEvent
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(
        public VaultShipment $vaultShipment,
        public int $vaultShipmentStatus
    ) {
    }
}
