<?php

namespace App\Http\Controllers\API\V2\Admin\VaultShipment;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\VaultShipment\VaultShipmentRequest;
use App\Http\Resources\API\V2\Admin\VaultShipment\VaultShipmentCollection;
use App\Http\Resources\API\V2\Admin\VaultShipment\VaultShipmentResource;
use App\Models\VaultShipment;
use App\Services\Admin\V2\VaultShipmentService;

class VaultShipmentController extends Controller
{
    public function __construct(private VaultShipmentService $vaultShipmentService)
    {
    }

    public function index(): VaultShipmentCollection
    {
        return new VaultShipmentCollection(
            $this->vaultShipmentService->getVaultCards()
        );
    }

    public function show(int $vaultShipmentId): VaultShipmentResource
    {
        return new VaultShipmentResource(
            $this->vaultShipmentService->getVault($vaultShipmentId)
        );
    }

    public function updateShipment(VaultShipment $vaultShipment, VaultShipmentRequest $request) {
        $result = $this->vaultShipmentService->updateShipment($vaultShipment, $request->shipping_provider, $request->tracking_number);
        return new VaultShipmentResource($result);
    }
}
