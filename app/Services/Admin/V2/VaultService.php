<?php

namespace App\Services\Admin\V2;

use App\Models\VaultShipment;
use Spatie\QueryBuilder\QueryBuilder;

class VaultService {
    protected const LIST_VAULT_PER_PAGE = 15;

    public function getVaultCards() {
        return QueryBuilder::for(VaultShipment::class)->allowedFilters(VaultShipment::getAllowedAdminFilters())->allowedIncludes(VaultShipment::getAllowedAdminIncludes())->paginate((request('per_page', self::LIST_VAULT_PER_PAGE)));
    }

    public function getVault(int $vaultId) {
        return QueryBuilder::for(VaultShipment::class)->allowedIncludes(VaultShipment::getAllowedAdminIncludes())->findOrFail($vaultId);
    }

    public function updateShipment(VaultShipment $vaultShipment, $shippingProvider, $trackingNumber) {

        $vaultShipment->shipping_provider = $shippingProvider;
        $vaultShipment->tracking_number = $trackingNumber;
        $vaultShipment->tracking_url = $this->getTrackingUrl($shippingProvider, $trackingNumber);

        $vaultShipment->save();
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