<?php

namespace App\Http\Resources\API\V2\Salesman\Order;

use App\Http\Resources\API\V2\Admin\Coupon\CouponResource;
use App\Http\Resources\API\V2\Admin\Customer\CustomerResource;
use App\Http\Resources\API\V2\Admin\Order\OrderItem\OrderItemCollection;
use App\Http\Resources\API\V2\Admin\Order\PaymentPlan\PaymentPlanResource;
use App\Http\Resources\API\V2\Admin\Order\ShippingMethod\ShippingMethodResource;
use App\Http\Resources\API\V2\Admin\User\UserResource;
use App\Models\Order;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Order */
class OrderCreateResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user' => new CustomerResource($this->user),
            'order_number' => $this->order_number,
            'order_items' => new OrderItemCollection($this->getGroupedOrderItems()),
            'payment_plan' => new PaymentPlanResource($this->paymentPlan),
            'coupon' => new CouponResource($this->coupon),
            'discounted_amount' => $this->discounted_amount,
            'payment_method_discounted_amount' => $this->payment_method_discounted_amount,
            'order_payment' => new OrderPaymentResource($this->firstOrderPayment),
            'billing_address' => new OrderAddressResource($this->billingAddress),
            'shipping_address' => new OrderAddressResource($this->shippingAddress),
            'shipping_method' => new ShippingMethodResource($this->shippingMethod),
            'service_fee' => $this->service_fee,
            'shipping_fee' => $this->shipping_fee,
            'payment_method_id' => $this->payment_method_id,
            'grand_total' => $this->grand_total_to_be_paid,
            'amount_paid_from_wallet' => $this->amount_paid_from_wallet,
            'order_step' => $this->order_step,
            'requires_cleaning' => $this->requires_cleaning,
            'cleaning_fee' => $this->cleaning_fee,
            'shipping_insurance_fee' => $this->shipping_insurance_fee,
            'requires_shipping_insurance' => $this->requires_shipping_insurance,
            'created_by' => new UserResource($this->createdBy),
            'salesman' => new UserResource($this->salesman),
        ];
    }
}
