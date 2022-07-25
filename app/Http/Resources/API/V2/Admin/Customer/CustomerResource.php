<?php

namespace App\Http\Resources\API\V2\Admin\Customer;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

/**
 * @property int $id
 * @property string $email
 * @property string|null $phone
 * @property string|null $profile_image
 * @property string|null $customer_number
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Wallet|null $wallet
 * @method orders()
 * @method cardsCount()
 * @method getFullName()
 */
class CustomerResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'profile_image' => $this->profile_image,
            'full_name' => $this->getFullName(),
            'customer_number' => $this->customer_number,
            'email' => $this->email,
            'phone' => $this->phone,
            'submissions' => $this->orders()->paid()->count(),
            'cards_count' => $this->cardsCount(),
            'wallet' => $this->wallet,
            'created_at' => $this->formatDate($this->created_at),
            'update_at' => $this->formatDate($this->updated_at),
        ];
    }
}
