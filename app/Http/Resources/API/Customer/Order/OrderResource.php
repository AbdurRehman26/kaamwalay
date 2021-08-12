<?php

namespace App\Http\Resources\API\Customer\Order;

use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemCollection;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Http\Resources\API\Customer\Order\ShippingMethod\ShippingMethodResource;
use App\Http\Resources\API\Customer\User\UserResource;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'number_of_cards' => $this->orderItems->sum('quantity'),
            'total_declared_value' => $this->orderItems->sum('declared_value_total'),
            'service_fee' => $this->service_fee,
            'shipping_fee' => $this->shipping_fee,
            'grand_total' => $this->grand_total,
            'created_at' => Carbon::parse($this->created_at)->toDate(),
            'customer' => new UserResource($this->user),
            'shipping_method' => new ShippingMethodResource($this->shippingMethod),
            'payment_plan' => new PaymentPlanResource($this->paymentPlan),
            'shipping_address' => new OrderAddressResource($this->shippingAddress),
            'billing_address' => new OrderAddressResource($this->billingAddress),
            'order_payment' => new OrderPaymentResource($this->orderPayment),
            'order_items' => new OrderItemCollection($this->orderItems),
        ];
    }
}
