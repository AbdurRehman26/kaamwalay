<?php

namespace App\Http\Resources\API\V3\Customer\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V3\Customer\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\V3\Customer\Order\OrderPaymentPlan\OrderPaymentPlanResource;
use App\Http\Resources\API\V3\Customer\Order\ShippingMethod\ShippingMethodResource;
use App\Models\Order;

/**
 * @mixin Order
 * @property mixed $number_of_cards
 * @property mixed $total_declared_value
 */
class OrderListResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'number_of_cards' => $this->number_of_cards,
            'total_declared_value' => $this->total_declared_value,
            'created_at' => $this->formatDate($this->created_at),
            'shipping_method' => $this->whenLoaded('shippingMethod', ShippingMethodResource::class),
            'payment_plan' => $this->whenLoaded('paymentPlan', OrderPaymentPlanResource::class),
            'order_payment' => $this->whenLoaded('firstOrderPayment', OrderPaymentResource::class),
            'invoice' => $this->whenLoaded('invoice', InvoiceResource::class),
            'order_shipment' => $this->whenLoaded('orderShipment', OrderShipmentResource::class),
            'order_customer_shipment' => $this->whenLoaded('orderCustomerShipment', OrderCustomerShipmentResource::class),
            'order_status' => $this->whenLoaded('orderStatus', OrderStatusResource::class),
        ];
    }
}
