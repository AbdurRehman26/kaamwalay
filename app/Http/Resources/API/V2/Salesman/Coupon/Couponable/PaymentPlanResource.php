<?php

namespace App\Http\Resources\API\V2\Salesman\Coupon\Couponable;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

/**
 * @property int $id
 * @property mixed $price
 */
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
