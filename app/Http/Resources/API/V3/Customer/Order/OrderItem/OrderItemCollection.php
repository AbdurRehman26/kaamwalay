<?php


namespace App\Http\Resources\API\V3\Customer\Order\OrderItem;

use App\Models\OrderStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class OrderItemCollection extends ResourceCollection
{
    protected OrderStatus $orderStatus;

    public function orderStatus(OrderStatus $value): OrderItemCollection
    {
        $this->orderStatus = $value;

        return $this;
    }

    /**
     * Transform the resource collection into an array.
     *
     * @param  Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable<int, mixed>|\JsonSerializable
     */
    public function toArray(Request $request)
    {
        return $this->collection->map(function (OrderItemResource $resource) use ($request) {
            return $resource->orderStatus($this->orderStatus)->toArray($request);
        })->all();
    }
}
