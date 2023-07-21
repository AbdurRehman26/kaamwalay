<?php

namespace App\Http\Resources\API\V3\Customer\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V3\Customer\Coupon\CouponResource;
use App\Http\Resources\API\V3\Customer\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\V3\Customer\Order\OrderItem\OrderItemResource;
use App\Http\Resources\API\V3\Customer\Order\OrderPaymentPlan\OrderPaymentPlanResource;
use App\Http\Resources\API\V3\Customer\Order\ShippingMethod\ShippingMethodResource;
use App\Models\Order;

/** @mixin Order */
class OrderResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'number_of_cards' => (int) $this->orderItems()->sum('quantity'),
            'total_declared_value' => (float) $this->orderItems()->sum('declared_value_total'),
            'service_fee' => $this->service_fee,
            'shipping_fee' => $this->shipping_fee,
            'cleaning_fee' => $this->cleaning_fee,
            'shipping_insurance_fee' => $this->shipping_insurance_fee,
            'grand_total' => $this->grand_total - $this->amount_paid_from_wallet,
            'created_at' => $this->formatDate($this->created_at),
            'customer' => $this->whenLoaded('user', UserResource::class),
            'shipping_method' => $this->whenLoaded('shippingMethod', ShippingMethodResource::class),
            'payment_plan' => $this->whenLoaded('paymentPlan', OrderPaymentPlanResource::class),
            'shipping_address' => $this->whenLoaded('shippingAddress', OrderAddressResource::class),
            'billing_address' => $this->whenLoaded('billingAddress', OrderAddressResource::class),
            'order_payment' => $this->whenLoaded('firstOrderPayment', OrderPaymentResource::class),
            'order_items' => $this->whenLoaded('orderItems', OrderItemResource::collection($this->orderItems)),
            'invoice' => $this->whenLoaded('invoice', InvoiceResource::class),
            'original_payment_plan' => $this->whenLoaded('originalPaymentPlan', OrderPaymentPlanResource::class),
            'order_shipment' => $this->whenLoaded('orderShipment', OrderShipmentResource::class),
            'order_customer_shipment' => $this->whenLoaded('orderCustomerShipment', OrderCustomerShipmentResource::class),
            'order_status' => $this->whenLoaded('orderStatus', OrderStatusResource::class),
            'order_status_history' => $this->whenLoaded('orderStatusHistory', OrderStatusHistoryResource::collection($this->orderStatusHistory)),
            'extra_charges' => $this->whenLoaded('extraCharges', OrderPaymentResource::collection($this->extraCharges)),
            'refunds' => $this->whenLoaded('refunds', OrderPaymentResource::collection($this->refunds)),
            'extra_charge_total' => $this->extra_charge_total,
            'refund_total' => $this->refund_total,
            'coupon' => $this->whenLoaded('coupon', CouponResource::class),
            'discounted_amount' => $this->discounted_amount,
            'payment_method_discounted_amount' => $this->payment_method_discounted_amount,
            'payment_method_id' => $this->payment_method_id,
            'amount_paid_from_wallet' => $this->amount_paid_from_wallet,
            'payment_status' => $this->payment_status,
            'order_step' => $this->order_step,
            'requires_cleaning' => $this->requires_cleaning,
            'requires_shipping_insurance' => $this->requires_shipping_insurance,
            'estimated_delivery_start_at' => $this->estimated_delivery_start_at,
            'estimated_delivery_end_at' => $this->estimated_delivery_end_at,
        ];
    }
}
