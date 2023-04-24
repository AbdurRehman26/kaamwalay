<?php


namespace App\Http\Resources\API\V3\Customer\Order\OrderItem;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class OrderItemCollection extends ResourceCollection
{
    protected $orderStatus;

    public function orderStatus($value){
        $this->orderStatus = $value;
        return $this;
    }
    /**
     * Transform the resource collection into an array.
     */
    public function toArray(Request $request)
    {
        return $this->collection->map(function (OrderItemResource $resource) use ($request) {
            return $resource->orderStatus($this->orderStatus)->toArray($request);
        })->all();
    }
}
