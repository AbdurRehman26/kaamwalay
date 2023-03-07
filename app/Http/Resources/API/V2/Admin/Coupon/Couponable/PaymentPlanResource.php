<?php

namespace App\Http\Resources\API\V2\Admin\Coupon\Couponable;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;

/**
 * @property int $id
 * @property mixed $price
 */
class PaymentPlanResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'price' => $this->price,
        ];
    }
}
