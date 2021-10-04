<?php

namespace App\Http\Resources\API\Admin\Order;

use App\Http\Resources\API\Admin\Order\OrderItem\OrderItemCollection;
use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\Customer\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\Customer\Order\OrderAddressResource;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Http\Resources\API\Customer\Order\ShippingMethod\ShippingMethodResource;
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
            'created_at' => $this->formatDate($this->created_at),
            'reviewed_by' => $this->reviewedBy(fn (?OrderStatusHistory $history) => $history?->user?->getFullName()),
            'reviewed_at' => $this->reviewedBy(fn (?OrderStatusHistory $history) => $this->formatDate($history?->updated_at)),
            'graded_by' => $this->gradedBy(fn (?OrderStatusHistory $history) => $history?->user?->getFullName()),
            'graded_at' => $this->gradedBy(fn (?OrderStatusHistory $history) => $this->formatDate($history?->updated_at)),
            'auto_saved_at' => $this->formatDate($this->auto_saved_at),
            'total_graded_items' => $this->when($this->order_status_id === OrderStatus::ARRIVED, fn () => $this->getTotalGradedItems()),
            'notes' => $this->notes,

            'order_status' => $this->whenLoaded('orderStatus', OrderStatusResource::class),
            'order_status_history' => $this->whenLoaded('orderStatusHistory', OrderStatusHistoryCollection::class),
            'customer' => $this->whenLoaded('user', OrderCustomerResource::class),
            'shipping_method' => $this->whenLoaded('shippingMethod', ShippingMethodResource::class),
            'payment_plan' => $this->whenLoaded('paymentPlan', PaymentPlanResource::class),
            'shipping_address' => $this->whenLoaded('shippingAddress', OrderAddressResource::class),
            'billing_address' => $this->whenLoaded('billingAddress', OrderAddressResource::class),
            'order_payment' => $this->whenLoaded('latestOrderPayment', OrderPaymentResource::class),
            'order_items' => $this->whenLoaded('orderItems', OrderItemCollection::class),
            'invoice' => $this->whenLoaded('invoice', InvoiceResource::class),
            'order_customer_shipment' => $this->whenLoaded('orderCustomerShipment', OrderCustomerShipmentResource::class),
            'order_shipment' => $this->whenLoaded('orderShipment', OrderShipmentResource::class),
            'extra_charges' => $this->whenLoaded('extraCharges', OrderPaymentCollection::class),
        ];
    }

    private function reviewedBy(Closure $selector)
    {
        return $this->when($this->order_status_id >= OrderStatus::ARRIVED, function () use ($selector) {
            return $selector($this->orderStatusHistory()->where('order_status_id', OrderStatus::ARRIVED)->latest()->first());
        });
    }

    private function gradedBy(Closure $selector)
    {
        return $this->when($this->order_status_id >= OrderStatus::GRADED, function () use ($selector) {
            return $selector($this->orderStatusHistory()->where('order_status_id', OrderStatus::GRADED)->latest()->first());
        });
    }
}
