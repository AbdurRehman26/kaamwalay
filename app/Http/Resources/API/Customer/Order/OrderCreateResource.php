<?php

namespace App\Http\Resources\API\Customer\Order;

use App\Http\Resources\API\Customer\Coupon\CouponResource;
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
            'order_items' => new OrderItemCollection($this->getGroupedOrderItems()),
            'payment_plan' => new PaymentPlanResource($this->paymentPlan),
            'coupon' => new CouponResource($this->coupon),
            'discounted_amount' => $this->discounted_amount,
            'order_payment' => new OrderPaymentResource($this->firstOrderPayment),
            'billing_address' => new OrderAddressResource($this->billingAddress),
            'shipping_address' => new OrderAddressResource($this->shippingAddress),
            'shipping_method' => new ShippingMethodResource($this->shippingMethod),
            'service_fee' => $this->service_fee,
            'shipping_fee' => $this->shipping_fee,
            'grand_total' => $this->grand_total,
        ];
    }
}
