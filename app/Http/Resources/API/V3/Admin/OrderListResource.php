<?php

namespace App\Http\Resources\API\V3\Admin;

use App\Http\Resources\API\V2\Admin\Order\OrderListResource as V2OrderOrderListResource;
use Illuminate\Http\Request;

class OrderListResource extends V2OrderOrderListResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);

        return array_merge($data, [
            'referrer' => $this->user?->referredBy,
        ]);
    }
}
