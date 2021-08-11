<?php

namespace App\Http\Resources\API\Customer\Order;

use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemCollection;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Http\Resources\API\Customer\Order\ShippingMethod\ShippingMethodResource;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderCreateResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'order_items' => new OrderItemCollection($this->orderItems),
            'payment_plan' => new PaymentPlanResource($this->paymentPlan),
            'order_payment' => new OrderPaymentResource($this->orderPayment),
            'billing_address' => new OrderAddressResource($this->billingAddress),
            'shipping_address' => new OrderAddressResource($this->shippingAddress),
            'shipping_method' => new ShippingMethodResource($this->shippingMethod),
            'shipping_fee' => $this->shipping_fee,
            'grand_total' => $this->grand_total,
        ];
    }
}
