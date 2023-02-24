<?php

namespace App\Http\Resources\API\V3\Admin\ReferralProgram\Referee;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V3\Admin\Salesman\SalesmanResource;
use App\Http\Resources\API\V3\Admin\User\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * @mixin User
 */
class RefereeResource extends BaseResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->getFullName(),
            'customer_number' => $this->customer_number,
            'email' => $this->email,
            'phone' => $this->phone,
            'submissions' => $this->orders()->paid()->count(),
            'cards_count' => $this->cardsCount(),
            'wallet' => $this->wallet,
            'created_at' => $this->formatDate($this->created_at),
            'salesman' => new SalesmanResource($this->salesman),
            'referred_by' => new UserResource($this->referredBy),
        ];
    }
}
