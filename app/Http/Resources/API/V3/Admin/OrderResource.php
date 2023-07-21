<?php

namespace App\Http\Resources\API\V3\Admin;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V3\Admin\Coupon\CouponResource;
use App\Http\Resources\API\V3\Admin\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\V3\Admin\Order\OrderAddressResource;
use App\Http\Resources\API\V3\Admin\Order\OrderCertificate\OrderCertificateResource;
use App\Http\Resources\API\V3\Admin\Order\OrderCustomerResource;
use App\Http\Resources\API\V3\Admin\Order\OrderCustomerShipmentResource;
use App\Http\Resources\API\V3\Admin\Order\OrderItem\OrderItemResource;
use App\Http\Resources\API\V3\Admin\Order\OrderLabel\OrderLabelResource;
use App\Http\Resources\API\V3\Admin\Order\OrderPaymentPlan\OrderPaymentPlanResource;
use App\Http\Resources\API\V3\Admin\Order\OrderPaymentResource;
use App\Http\Resources\API\V3\Admin\Order\OrderShipmentResource;
use App\Http\Resources\API\V3\Admin\Order\OrderStatusHistoryResource;
use App\Http\Resources\API\V3\Admin\Order\OrderStatusResource;
use App\Http\Resources\API\V3\Admin\Order\ShippingMethod\ShippingMethodResource;
use App\Http\Resources\API\V3\Admin\User\UserResource;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use Closure;
use Illuminate\Http\Request;

/**
 * @mixin Order;
 */
class OrderResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'number_of_cards' => (int)$this->orderItems()->sum('quantity'),
            'total_declared_value' => (float)$this->orderItems()->sum('declared_value_total'),
            'service_fee' => $this->service_fee,
            'shipping_fee' => $this->shipping_fee,
            'cleaning_fee' => $this->cleaning_fee,
            'shipping_insurance_fee' => $this->shipping_insurance_fee,
            'grand_total' => $this->grand_total - $this->amount_paid_from_wallet,
            'customer_id' => $this->user_id,
            'created_at' => $this->formatDate($this->created_at),
            'reviewed_by' => $this->reviewedBy(fn (?OrderStatusHistory $history) => $history?->user?->getFullName()),
            'reviewed_at' => $this->formatDate($this->reviewed_at),
            'graded_by' => $this->gradedBy(fn (?OrderStatusHistory $history) => $history?->user?->getFullName()),
            'graded_at' => $this->formatDate($this->graded_at),
            'shipped_at' => $this->formatDate($this->shipped_at),
            'auto_saved_at' => $this->formatDate($this->auto_saved_at),
            'total_graded_items' => $this->when($this->order_status_id === OrderStatus::CONFIRMED, fn () => $this->getTotalGradedItems()),
            'notes' => $this->notes,
            'created_by' => $this->whenLoaded('createdBy', UserResource::class),
            'owner' => $this->whenLoaded('salesman', UserResource::class),
            'order_status' => $this->whenLoaded('orderStatus', OrderStatusResource::class),
            'order_status_history' => $this->whenLoaded('orderStatusHistory', OrderStatusHistoryResource::collection($this->orderStatusHistory)),
            'customer' => $this->whenLoaded('user', OrderCustomerResource::class),
            'shipping_method' => $this->whenLoaded('shippingMethod', ShippingMethodResource::class),
            'payment_plan' => $this->whenLoaded('paymentPlan', OrderPaymentPlanResource::class),
            'shipping_address' => $this->whenLoaded('shippingAddress', OrderAddressResource::class),
            'billing_address' => $this->whenLoaded('billingAddress', OrderAddressResource::class),
            'order_payment' => $this->whenLoaded('firstOrderPayment', OrderPaymentResource::class),
            'order_items' => $this->whenLoaded('orderItems', OrderItemResource::collection($this->orderItems)),
            'invoice' => $this->whenLoaded('invoice', InvoiceResource::class),
            'order_label' => $this->whenLoaded('orderLabel', OrderLabelResource::class),
            'order_certificate' => $this->whenLoaded('orderCertificate', OrderCertificateResource::class),
            'order_customer_shipment' => $this->whenLoaded('orderCustomerShipment', OrderCustomerShipmentResource::class),
            'order_shipment' => $this->whenLoaded('orderShipment', OrderShipmentResource::class),
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
            'requires_cleaning' => $this->requires_cleaning,
            'requires_shipping_insurance' => $this->requires_shipping_insurance,
            'salesman_commission' => $this->salesman_commission,
            'referral_commission' => $this->referral_total_commission,
            'tags' => $this->whenLoaded('tags', TagResource::collection($this->tags)),
        ];
    }

    protected function reviewedBy(Closure $selector): mixed
    {
        return $this->when($this->order_status_id >= OrderStatus::CONFIRMED, function () use ($selector) {
            return $selector($this->orderStatusHistory()->where('order_status_id', OrderStatus::CONFIRMED)->latest()->first());
        });
    }

    protected function gradedBy(Closure $selector): mixed
    {
        return $this->when($this->order_status_id >= OrderStatus::GRADED, function () use ($selector) {
            return $selector($this->orderStatusHistory()->where('order_status_id', OrderStatus::GRADED)->latest()->first());
        });
    }
}
