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
                $shipment = $item->orderItemShipment;

                if (! $shipment) {
                    $shipment = new OrderItemShipment();
                }
                $shipment->shipping_provider = $shippingProvider;
                $shipment->tracking_number = $trackingNumber;
                $shipment->tracking_url = $this->getTrackingUrl($shippingProvider, $trackingNumber);
                $shipment->shipment_date = new \Datetime();
                $shipment->shipping_method_id = $order->shipping_method_id;
                $shipment->save();

                if (! $item->order_item_shipment_id) {
                    $item->order_item_shipment_id = $shipment->id;
                    $item->save();
                }
            }
            $shippedStatus = OrderStatus::whereCode('shipped')->first();
            if ($order->order_status_id !== $shippedStatus->id) {
                $this->orderStatusHistoryService->addStatusToOrder($shippedStatus, $order);
            }

            return $shipment;
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            throw new ShipmentNotUpdated();
        }
    }

    public function getTrackingUrl(string $shippingProvider, string $trackingNumber): string
    {
        if (strtolower($shippingProvider) === 'usps') {
            return 'https://tools.usps.com/go/TrackConfirmAction.action?tLabels=' . $trackingNumber;
        } elseif (strtolower($shippingProvider) === 'ups') {
            return 'https://wwwapps.ups.com/WebTracking/processRequest?HTMLVersion=5.0&Requester=NES&AgreeToTermsAndConditions=yes&loc=en_US&tracknum=' . $trackingNumber . '/trackdetails';
        } elseif (strtolower($shippingProvider) === 'fedex') {
            return 'https://www.fedex.com/fedextrack/?trknbr=' . $trackingNumber . '&trkqual=2459465000~' . $trackingNumber . '~FX';
        } elseif (strtolower($shippingProvider) === 'dhlexpress') {
            return 'https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=' . $trackingNumber;
        } else {
            return '';
        }
    }
}
