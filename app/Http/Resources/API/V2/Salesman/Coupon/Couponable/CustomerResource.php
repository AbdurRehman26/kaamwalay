<?php

namespace App\Http\Resources\API\V2\Salesman\Coupon\Couponable;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @method getFullName()
 */
class CustomerResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->getFullName(),
            'email' => $this->email,
        ];
    }
}
