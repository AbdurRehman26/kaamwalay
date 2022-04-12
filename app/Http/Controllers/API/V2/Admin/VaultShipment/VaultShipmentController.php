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

    public function index() {
        $vault = $this->vaultShipmentService->getVaultCards();
        return new VaultShipmentCollection($vault);
    }

    public function show(int $vaultId) {
        $vault = $this->vaultShipmentService->getVault($vaultId);
        return new VaultShipmentResource($vault); 
    }

    public function updateShipment(VaultShipmentRequest $request, VaultShipment $vaultShipment) {
        dd($vaultShipment);
        $result = $this->vaultShipmentService->updateShipment($vaultShipment, $request->shipping_provider, $request->tracking_number);
        return new VaultShipmentResource($result);
    }
}
