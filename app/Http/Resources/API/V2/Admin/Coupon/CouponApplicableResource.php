<?php

namespace App\Http\Resources\API\V2\Admin\Coupon;

use App\Http\Resources\API\BaseResource;

/**
 * @property int $id
 * @property string $code
 * @property string $label
 * @property string $description
 * @property bool $is_active
 */
class CouponApplicableResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'label' => $this->label,
            'description' => $this->description,
            'is_active' => $this->is_active,
        ];
    }
}
