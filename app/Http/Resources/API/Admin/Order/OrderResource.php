<?php

namespace App\Http\Resources\API\Admin\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\Customer\Order\OrderAddressResource;
use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemCollection;
use App\Http\Resources\API\Customer\Order\OrderPaymentResource;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Http\Resources\API\Customer\Order\ShippingMethod\ShippingMethodResource;
use App\Models\OrderStatusHistory;
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
            'number_of_cards' => $this->orderItems->sum('quantity'),
            'total_declared_value' => $this->orderItems->sum('declared_value_total'),
            'service_fee' => $this->service_fee,
            'shipping_fee' => $this->shipping_fee,
            'grand_total' => $this->grand_total,
            'created_at' => $this->formatDate($this->created_at),
            'reviewed_by' => $this->when(! is_null($this->reviewedBy), ! is_null($this->reviewedBy) ? $this->reviewedBy->getFullName() : null),
            'reviewed_at' => $this->when(! is_null($this->reviewedBy), $this->reviewed_at),
            'graded_by' => $this->when(! is_null($this->gradedBy), ! is_null($this->gradedBy) ? $this->gradedBy->getFullName() : null),
            'graded_at' => $this->when(! is_null($this->gradedBy), $this->graded_at),
            'notes' => $this->notes,

            'order_status' => $this->whenLoaded('orderStatus', OrderStatusResource::class),
            'order_status_history' => $this->whenLoaded('orderStatusHistory', OrderStatusHistoryCollection::class),
            'customer' => $this->whenLoaded('user', OrderCustomerResource::class),
            'shipping_method' => $this->whenLoaded('shippingMethod', ShippingMethodResource::class),
            'payment_plan' => $this->whenLoaded('paymentPlan', PaymentPlanResource::class),
            'shipping_address' => $this->whenLoaded('shippingAddress', OrderAddressResource::class),
            'billing_address' => $this->whenLoaded('billingAddress', OrderAddressResource::class),
            'order_payment' => $this->whenLoaded('orderPayment', OrderPaymentResource::class),
            'order_items' => $this->whenLoaded('orderItems', OrderItemCollection::class),
            'customer_shipment' => $this->whenLoaded('orderItems', fn () => $this->orderItems[0]->orderItemCustomerShipment),
            'invoice' => $this->whenLoaded('invoice', OrderItemCollection::class),
        ];
    }
}
