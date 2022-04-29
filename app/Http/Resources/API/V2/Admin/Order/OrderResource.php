<?php

namespace App\Http\Resources\API\V2\Admin\Order;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Admin\Coupon\CouponResource;
use App\Http\Resources\API\V2\Admin\Order\OrderItem\OrderItemCollection;
use App\Http\Resources\API\V2\Admin\Order\OrderLabel\OrderLabelResource;
use App\Http\Resources\API\V2\Customer\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\V2\Customer\Order\OrderAddressResource;
use App\Http\Resources\API\V2\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Http\Resources\API\V2\Customer\Order\ShippingMethod\ShippingMethodResource;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use Closure;
use Illuminate\Http\Request;

/**
 * @property OrderStatusHistory[] $orderStatusHistory
 * @property mixed $notes
 * @property mixed $graded_at
 * @property mixed $gradedBy
 * @property mixed $reviewed_at
 * @property mixed $reviewedBy
 * @property mixed $orderItems
 * @property mixed $invoice
 * @property mixed $orderLabel
 * @property mixed $orderPayment
 * @property mixed $billingAddress
 * @property mixed $shippingAddress
 * @property mixed $paymentPlan
 * @property mixed $shippingMethod
 * @property mixed $user
 * @property mixed $created_at
 * @property mixed $grand_total
 * @property mixed $shipping_fee
 * @property mixed $service_fee
 * @property mixed $order_number
 * @property mixed $id
 * @property mixed $auto_saved_at
 * @property mixed $order_status_id
 * @property mixed $extra_charge_total
 * @property mixed $refund_total
 * @property mixed $discounted_amount
 * @property mixed $payment_method_discounted_amount
 * @property mixed $payment_method_id
 * @property mixed $amount_paid_from_wallet
 * @property mixed $user_id
 * @property OrderPaymentStatusEnum $payment_status
 * @method orderItems()
 * @method orderStatusHistory()
 * @method getTotalGradedItems()
 */
class OrderResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'number_of_cards' => (int)$this->orderItems()->sum('quantity'),
            'total_declared_value' => (float)$this->orderItems()->sum('declared_value_total'),
            'service_fee' => $this->service_fee,
            'shipping_fee' => $this->shipping_fee,
            'grand_total' => $this->grand_total,
            'customer_id' => $this->user_id,
            'created_at' => $this->formatDate($this->created_at),
            'reviewed_by' => $this->reviewedBy(fn (?OrderStatusHistory $history) => $history?->user?->getFullName()),
            'reviewed_at' => $this->reviewedBy(fn (?OrderStatusHistory $history) => $this->formatDate($history?->updated_at)),
            'graded_by' => $this->gradedBy(fn (?OrderStatusHistory $history) => $history?->user?->getFullName()),
            'graded_at' => $this->gradedBy(fn (?OrderStatusHistory $history) => $this->formatDate($history?->updated_at)),
            'auto_saved_at' => $this->formatDate($this->auto_saved_at),
            'total_graded_items' => $this->when($this->order_status_id === OrderStatus::CONFIRMED, fn () => $this->getTotalGradedItems()),
            'notes' => $this->notes,

            'order_status' => $this->whenLoaded('orderStatus', OrderStatusResource::class),
            'order_status_history' => $this->whenLoaded('orderStatusHistory', OrderStatusHistoryCollection::class),
            'customer' => $this->whenLoaded('user', OrderCustomerResource::class),
            'shipping_method' => $this->whenLoaded('shippingMethod', ShippingMethodResource::class),
            'payment_plan' => $this->whenLoaded('paymentPlan', PaymentPlanResource::class),
            'shipping_address' => $this->whenLoaded('shippingAddress', OrderAddressResource::class),
            'billing_address' => $this->whenLoaded('billingAddress', OrderAddressResource::class),
            'order_payment' => $this->whenLoaded('firstOrderPayment', OrderPaymentResource::class),
            'order_items' => $this->whenLoaded('orderItems', OrderItemCollection::class),
            'invoice' => $this->whenLoaded('invoice', InvoiceResource::class),
            'order_label' => $this->whenLoaded('orderLabel', OrderLabelResource::class),
            'order_customer_shipment' => $this->whenLoaded('orderCustomerShipment', OrderCustomerShipmentResource::class),
            'order_shipment' => $this->whenLoaded('orderShipment', OrderShipmentResource::class),
            'extra_charges' => $this->whenLoaded('extraCharges', OrderPaymentCollection::class),
            'refunds' => $this->whenLoaded('refunds', OrderPaymentCollection::class),
            'extra_charge_total' => $this->extra_charge_total,
            'refund_total' => $this->refund_total,
            'coupon' => $this->whenLoaded('coupon', CouponResource::class),
            'discounted_amount' => $this->discounted_amount,
            'payment_method_discounted_amount' => $this->payment_method_discounted_amount,
            'payment_method_id' => $this->payment_method_id,
            'amount_paid_from_wallet' => $this->amount_paid_from_wallet,
            'payment_status' => $this->payment_status,
        ];
    }

    private function reviewedBy(Closure $selector): mixed
    {
        return $this->when($this->order_status_id >= OrderStatus::CONFIRMED, function () use ($selector) {
            return $selector($this->orderStatusHistory()->where('order_status_id', OrderStatus::CONFIRMED)->latest()->first());
        });
    }

    private function gradedBy(Closure $selector): mixed
    {
        return $this->when($this->order_status_id >= OrderStatus::GRADED, function () use ($selector) {
            return $selector($this->orderStatusHistory()->where('order_status_id', OrderStatus::GRADED)->latest()->first());
        });
    }
}
