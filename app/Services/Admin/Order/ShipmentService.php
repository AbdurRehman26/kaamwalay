<?php

namespace App\Services\Admin\Order;

use App\Exceptions\API\Admin\Order\OrderCanNotBeMarkedAsGraded;
use App\Models\Order;
use App\Models\OrderItemShipment;
use App\Models\OrderStatus;
use App\Services\Admin\OrderStatusHistoryService;
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
    public function updateShipment(Order $order, string $shippingProvider, string $trackingNumber): OrderItemShipment
    {
        $items = $order->orderItems()->with('orderItemShipment')->get();
        $shipment = null;

        foreach ($items as $item) {
            $shipment = $item->orderItemShipment;
            $data = [
                'shipment_date' => now(),
                'tracking_url' => $this->getTrackingUrl($shippingProvider, $trackingNumber),
                'shipping_method_id' => $order->shipping_method_id,
                'shipping_provider' => $shippingProvider,
                'tracking_number' => $trackingNumber,
            ];

            if (! $shipment) {
                $shipment = OrderItemShipment::create();
            } else {
                $shipment->update($data);
            }

            if ($item->order_item_shipment_id !== $shipment->id) {
                $item->order_item_shipment_id = $shipment->id;
                $item->save();
            }
        }

        $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::SHIPPED, $order);

        return $shipment;
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
