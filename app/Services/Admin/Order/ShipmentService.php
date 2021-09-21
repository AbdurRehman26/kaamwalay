<?php

namespace App\Services\Admin\Order;

use App\Exceptions\API\Admin\Order\ShipmentNotUpdated;
use App\Models\Order;
use App\Models\OrderItemShipment;
use App\Models\OrderStatus;
use App\Services\Admin\OrderStatusHistoryService;
use Illuminate\Support\Facades\Log;

class ShipmentService
{
    public function __construct(protected OrderStatusHistoryService $orderStatusHistoryService)
    {
    }

    public function updateShipment(Order $order, string $shippingProvider, string $trackingNumber): OrderItemShipment
    {
        try {
            $items = $order->orderItems;

            foreach ($items as $item) {
                $shipment = OrderItemShipment::firstOrCreate([

                    'shipping_provider' => $shippingProvider,
                    'tracking_number' => $trackingNumber,
                    'tracking_url' => $this->getTrackingUrl($shippingProvider, $trackingNumber),
                    'shipment_date' => new \Datetime(),
                    'shipping_method_id' => $order->shipping_method_id,
                ]);

                if (! $item->order_item_shipment_id) {
                    $item->order_item_shipment_id = $shipment->id;
                    $item->save();
                }
            }

            $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::SHIPPED, $order);

            return $shipment;
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            throw new ShipmentNotUpdated();
        }
    }

    protected function getTrackingUrl(string $shippingProvider, string $trackingNumber): string
    {
        switch (strtolower($shippingProvider)) {
            case 'usps':
                return 'https://tools.usps.com/go/TrackConfirmAction.action?tLabels=' . $trackingNumber;
            case 'ups':
                return 'https://wwwapps.ups.com/WebTracking/processRequest?HTMLVersion=5.0&Requester=NES&AgreeToTermsAndConditions=yes&loc=en_US&tracknum=' . $trackingNumber . '/trackdetails';
            case 'fedex':
                return 'https://www.fedex.com/fedextrack/?trknbr=' . $trackingNumber . '&trkqual=2459465000~' . $trackingNumber . '~FX';
            case 'dhlexpress':
                return 'https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=' . $trackingNumber;
            default:
                return null;
        }
    }
}
