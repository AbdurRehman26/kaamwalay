<?php

namespace App\Http\Resources\API\V2\Salesman\Coupon;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;

/**
 * @property int $id
 * @property string $code
 * @property string $name
 */
class CouponStatusResource extends BaseResource
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
            'code' => $this->code,
            'name' => $this->name,
        ];
    }
}
