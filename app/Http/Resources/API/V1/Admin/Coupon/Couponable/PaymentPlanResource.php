<?php

namespace App\Http\Resources\API\V1\Admin\Coupon\Couponable;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

class PaymentPlanResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'price' => $this->price,
        ];
    }
}
