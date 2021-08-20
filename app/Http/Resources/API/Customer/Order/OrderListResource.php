<?php

namespace App\Http\Resources\API\Customer\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\Customer\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemCustomerShipmentResource;

class OrderListResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'created_at' => $this->formatDate($this->created_at),
            'arrived_at' => $this->formatDate($this->arrived_at),
            'payment_plan' => new PaymentPlanResource($this->paymentPlan),
            'number_of_cards' => $this->orderItems->sum('quantity'),
            'status' => $this->orderStatus->name,
            'invoice' => new InvoiceResource($this->invoice),
            'customer_shipment' => count($this->orderItems) > 0 ? new OrderItemCustomerShipmentResource($this->orderItems[0]->orderItemCustomerShipment) : null,
        ];
    }
}
