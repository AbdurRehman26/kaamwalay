<?php

namespace App\Http\Resources\API\V3\Admin;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V3\Admin\Coupon\CouponResource;
use App\Http\Resources\API\V3\Admin\Order\Invoice\InvoiceResource;
use App\Http\Resources\API\V3\Admin\Order\OrderCustomerResource;
use App\Http\Resources\API\V3\Admin\Order\OrderCustomerShipmentResource;
use App\Http\Resources\API\V3\Admin\Order\OrderLabel\OrderLabelResource;
use App\Http\Resources\API\V3\Admin\Order\OrderShipmentResource;
use App\Http\Resources\API\V3\Admin\Order\OrderStatusHistoryResource;
use App\Http\Resources\API\V3\Admin\Order\OrderStatusResource;
use App\Http\Resources\API\V3\Admin\Order\ShippingMethod\ShippingMethodResource;
use App\Http\Resources\API\V3\Admin\User\UserResource;
use App\Models\Order;
use Illuminate\Http\Request;

/**
 * @mixin Order
 * @property mixed $number_of_cards
 * @property mixed $total_declared_value
 */
class OrderListResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'number_of_cards' => $this->number_of_cards,
            'total_declared_value' => $this->total_declared_value,
            'grand_total' => $this->grand_total,
            'customer' => $this->whenLoaded('user', OrderCustomerResource::class),
            'owner' => $this->whenLoaded('salesman', UserResource::class),
            'order_status' => $this->whenLoaded('orderStatus', OrderStatusResource::class),
            'payment_status' => $this->payment_status,
            'invoice' => $this->whenLoaded('invoice', InvoiceResource::class),
            'order_label' => $this->whenLoaded('orderLabel', OrderLabelResource::class),
            'order_status_history' => $this->whenLoaded('orderStatusHistory', OrderStatusHistoryResource::collection($this->orderStatusHistory)),
            'arrived' => ! is_null($this->arrived_at),
            'arrived_at' => $this->formatDate($this->arrived_at),
            'created_at' => $this->formatDate($this->created_at),
            'order_customer_shipment' => $this->whenLoaded('orderCustomerShipment', OrderCustomerShipmentResource::class),
            'order_shipment' => $this->whenLoaded('orderShipment', OrderShipmentResource::class),
            'shipping_method' => $this->whenLoaded('shippingMethod', ShippingMethodResource::class),
            'coupon' => $this->whenLoaded('coupon', CouponResource::class),
            'salesman_commission' => $this->salesman_commission,
            'tags' => $this->whenLoaded('tags', TagResource::collection($this->tags)),
        ];
    }
}
