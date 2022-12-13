<?php

namespace App\Http\Resources\API\V2\Salesman\Order;

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Customer\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\V2\Customer\Order\ShippingMethod\ShippingMethodResource;
use App\Http\Resources\API\V2\Salesman\Order\OrderLabel\OrderLabelResource;
use App\Http\Resources\API\V2\Salesman\User\UserResource;
use Illuminate\Http\Request;

/**
 * @property mixed $id
 * @property mixed $order_number
 * @property mixed $grand_total
 * @property mixed $salesman
 * @property mixed $amount_paid_from_wallet
 * @property mixed $arrived_at
 * @property mixed $created_at
 * @property mixed $orderItems
 * @property OrderPaymentStatusEnum $payment_status
 */
class OrderListResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'number_of_cards' => $this->orderItems->sum('quantity'),
            'total_declared_value' => $this->orderItems->sum('declared_value_total'),
            'grand_total' => $this->grand_total,
            'customer' => $this->whenLoaded('user', OrderCustomerResource::class),
            'owner' => new UserResource($this->salesman),
            'order_status' => $this->whenLoaded('orderStatus', OrderStatusResource::class),
            'payment_status' => $this->payment_status,
            'invoice' => $this->whenLoaded('invoice', InvoiceResource::class),
            'order_label' => $this->whenLoaded('orderLabel', OrderLabelResource::class),
            'order_status_history' => $this->whenLoaded('orderStatusHistory', OrderStatusHistoryCollection::class),
            'arrived' => ! is_null($this->arrived_at),
            'arrived_at' => $this->formatDate($this->arrived_at),
            'created_at' => $this->formatDate($this->created_at),
            'order_customer_shipment' => $this->whenLoaded('orderCustomerShipment', OrderCustomerShipmentResource::class),
            'order_shipment' => $this->whenLoaded('orderShipment', OrderShipmentResource::class),
            'shipping_method' => $this->whenLoaded('shippingMethod', ShippingMethodResource::class),
        ];
    }
}
