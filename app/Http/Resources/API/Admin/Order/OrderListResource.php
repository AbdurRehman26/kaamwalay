<?php

namespace App\Http\Resources\API\Admin\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\Customer\Order\Invoice\InvoiceResource;
use Illuminate\Http\Request;

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
            'order_status' => $this->whenLoaded('orderStatus', OrderStatusResource::class),
            'invoice' => $this->whenLoaded('invoice', InvoiceResource::class),
            'order_status_history' => $this->whenLoaded('orderStatusHistory', OrderStatusHistoryCollection::class),
            'arrived' => ! is_null($this->arrived_at),
            'arrived_at' => $this->formatDate($this->arrived_at),
            'created_at' => $this->formatDate($this->created_at),
        ];
    }
}
