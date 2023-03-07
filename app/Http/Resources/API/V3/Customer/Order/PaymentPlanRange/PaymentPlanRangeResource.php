<?php

namespace App\Http\Resources\API\V3\Customer\Order\PaymentPlanRange;

use Illuminate\Http\Request;
use App\Models\PaymentPlanRange;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PaymentPlanRange */
class PaymentPlanRangeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'min_cards' => $this->min_cards,
            'max_cards' => $this->max_cards,
            'price' => $this->price,
        ];
    }
}
