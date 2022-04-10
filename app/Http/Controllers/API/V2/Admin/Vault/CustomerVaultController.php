<?php

namespace App\Http\Controllers\API\V2\Admin\Vault;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Admin\Order\UpdateShipmentRequest;
use App\Http\Resources\API\V2\Admin\Vault\VaultShipmentCollection;
use App\Http\Resources\API\V2\Admin\Vault\VaultShipmentResource;
use App\Models\VaultShipment;
use App\Services\Admin\V2\VaultService;
use Illuminate\Http\Request;


class CustomerVaultController extends Controller
{
    public function __construct(private VaultService $vaultService)
    {
    }

    public function index() {
        $vault = $this->vaultService->getVaultCards();
        return new VaultShipmentCollection($vault);
    }

    public function show(int $vaultId) {
        $vault = $this->vaultService->getVault($vaultId);
        return new VaultShipmentResource($vault); 
    }

    public function updateShipment(UpdateShipmentRequest $request, VaultShipment $vaultShipment) {
        $result = $this->vaultService->updateShipment($vaultShipment, $request->shipping_provider, $request->tracking_number);
    }
}
