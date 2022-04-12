<?php

namespace App\Services\Admin\V2;

use App\Models\VaultShipment;
use App\Models\VaultShipmentStatus;
use App\Models\VaultShipmentStatusHistory;
use Spatie\QueryBuilder\QueryBuilder;

class VaultShipmentService {
    protected const LIST_VAULT_PER_PAGE = 15;

    public function getVaultCards() {
        return QueryBuilder::for(VaultShipment::class)->allowedFilters(VaultShipment::getAllowedAdminFilters())->allowedIncludes(VaultShipment::getAllowedAdminIncludes())->paginate((request('per_page', self::LIST_VAULT_PER_PAGE)));
    }

    public function updateShipment(VaultShipment $vaultShipment, $shippingProvider, $trackingNumber) {

        dd($vaultShipment);
        $vaultShipment = VaultShipment::find(19);        
        $vaultShipment->shipping_provider = $shippingProvider;
        $vaultShipment->tracking_number = $trackingNumber;
        $vaultShipment->tracking_url = $this->getTrackingUrl($shippingProvider, $trackingNumber);
        // status update 
        // cards status 
        // shipment status history
        // card status 

        // TODO: add status to user card  
        $vaultShipment->save();

        // VaultShipmentStatusHistory::create([
        //     'vault_shipment_id' => $vaultShipment->id,
        //     'vault_shipment_status_id' => VaultShipmentStatus::SHIPPED,
        //     'user_id' => $vaultShipment->user->id,
        // ]);

        return $vaultShipment;
    }

    //changeShipmentStatus

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
