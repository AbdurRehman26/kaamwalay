<?php

namespace App\Http\Controllers\API\V2\Customer\VaultShipment;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Customer\VaultShipment\VaultShipmentCollection;
use App\Services\VaultShipment\V2\VaultShipmentService;

class VaultShipmentController extends Controller
{
    public function __construct(
        protected VaultShipmentService $vaultShipmentService
    ) {
    }

    public function index(): VaultShipmentCollection
    {
        return new VaultShipmentCollection(
            $this->vaultShipmentService->getVaultShipments()
        );
    }
}
