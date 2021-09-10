<?php

namespace App\Http\Resources\API\Customer\Order;

use App\Http\Resources\API\Admin\Order\OrderStatusHistoryCollection;
use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\Customer\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemCustomerShipmentResource;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;

class OrderListResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'number_of_cards' => $this->orderItems->sum('quantity'),
            'customer_shipment' => count($this->orderItems) > 0 ? new OrderItemCustomerShipmentResource($this->orderItems[0]->orderItemCustomerShipment) : null,
            'payment_plan' => $this->whenLoaded('paymentPlan', PaymentPlanResource::class),
            'order_status_history' => $this->whenLoaded('orderStatusHistory', OrderStatusHistoryCollection::class),
            'invoice' => $this->whenLoaded('invoice', InvoiceResource::class),
            'created_at' => $this->formatDate($this->created_at),
            'arrived_at' => $this->formatDate($this->arrived_at),
        ];
    }
}
