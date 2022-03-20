<?php

namespace App\Services\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderCanNotBeMarkedAsGraded;
use App\Models\Order;
use App\Models\OrderShipment;
use App\Models\OrderStatus;
use App\Services\Admin\V1\OrderStatusHistoryService;
use Throwable;

class ShipmentService
{
    public function __construct(protected OrderStatusHistoryService $orderStatusHistoryService)
    {
    }

    /**
     * @throws OrderCanNotBeMarkedAsGraded
     * @throws Throwable
     */
    public function updateShipment(Order $order, string $shippingProvider, string $trackingNumber): OrderShipment
    {
        /** @var OrderShipment $orderShipment */
        $orderShipment = $order->orderShipment;

        if (! empty($orderShipment)) {
            $orderShipment->update([
                'shipping_provider' => $shippingProvider,
                'tracking_number' => $trackingNumber,
                'tracking_url' => $this->getTrackingUrl($shippingProvider, $trackingNumber),
            ]);
        } else {
            $orderShipment = OrderShipment::create([
                'shipping_provider' => $shippingProvider,
                'tracking_number' => $trackingNumber,
                'tracking_url' => $this->getTrackingUrl($shippingProvider, $trackingNumber),
                'shipping_method_id' => $order->shipping_method_id,
            ]);

            $order->orderShipment()->associate($orderShipment)->save();
        }

        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::SHIPPED, $order);

        return $orderShipment;
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
