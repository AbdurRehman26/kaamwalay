<?php

namespace App\Http\Resources\API\V2\Customer\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V1\Admin\Order\OrderCustomerShipmentResource;
use App\Http\Resources\API\V1\Admin\Order\OrderStatusHistoryCollection;
use App\Http\Resources\API\V1\Admin\Order\OrderStatusResource;
use App\Http\Resources\API\V1\Customer\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\V1\Customer\Order\PaymentPlan\PaymentPlanResource;

class OrderListResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'number_of_cards' => (int)$this->orderItems()->sum('quantity'),
            'order_customer_shipment' => $this->whenLoaded('orderCustomerShipment', OrderCustomerShipmentResource::class),
            'payment_plan' => $this->whenLoaded('paymentPlan', PaymentPlanResource::class),
            'order_status' => $this->whenLoaded('orderStatus', OrderStatusResource::class),
            'order_status_history' => $this->whenLoaded('orderStatusHistory', OrderStatusHistoryCollection::class),
            'invoice' => $this->whenLoaded('invoice', InvoiceResource::class),
            'created_at' => $this->formatDate($this->created_at),
            'arrived_at' => $this->formatDate($this->arrived_at),
        ];
    }
}
