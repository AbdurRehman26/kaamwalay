<?php

namespace App\Http\Resources\API\V1\Customer\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V1\Admin\Order\OrderShipmentResource;
use App\Http\Resources\API\V1\Admin\Order\OrderStatusHistoryCollection;
use App\Http\Resources\API\V1\Admin\Order\OrderStatusResource;
use App\Http\Resources\API\V1\Customer\Coupon\CouponResource;
use App\Http\Resources\API\V1\Customer\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\V1\Customer\Order\OrderItem\OrderItemCollection;
use App\Http\Resources\API\V1\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Http\Resources\API\V1\Customer\Order\ShippingMethod\ShippingMethodResource;
use App\Http\Resources\API\V1\Customer\User\UserResource;

class OrderResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'number_of_cards' => (int) $this->orderItems()->sum('quantity'),
            'total_declared_value' => (float) $this->orderItems()->sum('declared_value_total'),
            'status' => $this->orderStatus->name ?? null,
            'service_fee' => $this->service_fee,
            'shipping_fee' => $this->shipping_fee,
            'grand_total' => $this->grand_total,
            'created_at' => $this->formatDate($this->created_at),
            'customer' => new UserResource($this->user),
            'shipping_method' => new ShippingMethodResource($this->shippingMethod),
            'payment_plan' => new PaymentPlanResource($this->paymentPlan),
            'shipping_address' => new OrderAddressResource($this->shippingAddress),
            'billing_address' => new OrderAddressResource($this->billingAddress),
            'order_payment' => new OrderPaymentResource($this->firstOrderPayment),
            'order_items' => new OrderItemCollection($this->orderItems),
            'invoice' => new InvoiceResource($this->invoice),
            'order_shipment' => $this->whenLoaded('orderShipment', OrderShipmentResource::class),
            'order_customer_shipment' => $this->whenLoaded('orderCustomerShipment', OrderCustomerShipmentResource::class),
            'order_status' => $this->whenLoaded('orderStatus', OrderStatusResource::class),
            'order_status_history' => $this->whenLoaded('orderStatusHistory', OrderStatusHistoryCollection::class),
            'extra_charges' => $this->whenLoaded('extraCharges', OrderPaymentCollection::class),
            'refunds' => $this->whenLoaded('refunds', OrderPaymentCollection::class),
            'extra_charge_total' => $this->extra_charge_total,
            'refund_total' => $this->refund_total,
            'coupon' => $this->whenLoaded('coupon', CouponResource::class),
            'discounted_amount' => $this->discounted_amount,
            'payment_method_discounted_amount' => $this->payment_method_discounted_amount,
            'payment_method_id' => $this->payment_method_id,
        ];
    }
}
