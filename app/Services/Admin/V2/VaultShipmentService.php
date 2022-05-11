<?php

namespace App\Services\Admin\V2;

use App\Models\VaultShipment;
use App\Models\VaultShipmentStatus;
use App\Models\VaultShipmentStatusHistory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\QueryBuilder;

class VaultShipmentService
{
    protected const LIST_VAULT_PER_PAGE = 15;

    public function getVaultShipments(): LengthAwarePaginator
    {
        return QueryBuilder::for(VaultShipment::class)
            ->allowedFilters(VaultShipment::getAllowedAdminFilters())
            ->allowedIncludes(VaultShipment::getAllowedAdminIncludes())
            ->paginate((request('per_page', self::LIST_VAULT_PER_PAGE)));
    }

    public function getVaultShipment(int $vaultShipmentId): Model
    {
        return QueryBuilder::for(VaultShipment::class)
            ->allowedIncludes(VaultShipment::getAllowedAdminIncludes())
            ->findOrFail($vaultShipmentId);
    }

    public function updateShipment(VaultShipment $vaultShipment, string $shippingProvider, string $trackingNumber): VaultShipment
    {
        $vaultShipment->update([
            'shipping_provider' => $shippingProvider,
            'tracking_number' => $trackingNumber,
            'tracking_url' => $this->getTrackingUrl($shippingProvider, $trackingNumber),
            'vault_shipment_status_id' => VaultShipmentStatus::SHIPPED,
        ]);
    
        $vaultShipment->vaultShipmentItems->each(fn ($item) => $item->userCard->markAsShipped());
      
        $this->addVaultShipmentStatusHistory(VaultShipmentStatus::SHIPPED, $vaultShipment);
        
        return $vaultShipment;
    }

    protected function addVaultShipmentStatusHistory(int $vaultShipmentStatus, VaultShipment $vaultShipment): void
    {
        VaultShipmentStatusHistory::updateOrCreate([
            'vault_shipment_id' => $vaultShipment->id,
            'vault_shipment_status_id' => $vaultShipmentStatus,
            'user_id' => auth()->user()->id,
        ]);
    }

    protected function getTrackingUrl(string $shippingProvider, string $trackingNumber): ?string
    {
        return match (strtolower($shippingProvider)) {
            'usps' => 'https://tools.usps.com/go/TrackConfirmAction.action?tLabels=' . $trackingNumber,
            'ups' => 'https://wwwapps.ups.com/WebTracking/processRequest?HTMLVersion=5.0&Requester=NES&AgreeToTermsAndConditions=yes&loc=en_US&tracknum=' . $trackingNumber . '/trackdetails',
            'fedex' => 'https://www.fedex.com/fedextrack/?trknbr=' . $trackingNumber . '&trkqual=2459465000~' . $trackingNumber . '~FX',
            'dhlexpress' => 'https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=' . $trackingNumber,
            default => null,
        };
    }
}
