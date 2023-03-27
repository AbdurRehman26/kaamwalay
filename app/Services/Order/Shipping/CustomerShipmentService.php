<?php

namespace App\Services\Order\Shipping;

use App\Exceptions\API\Customer\Order\CustomerShipmentNotUpdated;
use App\Models\Order;
use App\Models\OrderCustomerShipment;
use Illuminate\Support\Facades\Log;

class CustomerShipmentService
{
    public function process(Order $order, string $shippingProvider, string $trackingNumber): Order
    {
        try {
            $orderCustomerShipment = $order->orderCustomerShipment;

            if ($orderCustomerShipment) {
                $orderCustomerShipment->update([
                    'shipping_provider' => $shippingProvider,
                    'tracking_number' => $trackingNumber,
                    'tracking_url' => $this->getTrackingUrl($shippingProvider, $trackingNumber),
                ]);
            } else {
                $orderCustomerShipment = OrderCustomerShipment::create([
                    'shipping_provider' => $shippingProvider,
                    'tracking_number' => $trackingNumber,
                    'tracking_url' => $this->getTrackingUrl($shippingProvider, $trackingNumber),
                ]);

                $order->orderCustomerShipment()->associate($orderCustomerShipment)->save();
            }

            return $order->refresh();
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            throw new CustomerShipmentNotUpdated;
        }
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
