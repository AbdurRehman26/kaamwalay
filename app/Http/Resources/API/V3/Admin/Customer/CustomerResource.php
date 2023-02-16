<?php

namespace App\Http\Resources\API\V3\Admin\Customer;

use App\Http\Resources\API\V2\Admin\Customer\CustomerResource as V2CustomerResource;
use App\Http\Resources\API\V3\Customer\User\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * @mixin User
 * @property mixed $referrer
 */
class CustomerResource extends V2CustomerResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        $data = parent::toArray($request);

        return array_merge($data, [
            'referred_by' => $this->whenLoaded('referredBy', UserResource::class),
            'referrer' => $this->whenLoaded('referrer', UserResource::class),
        ]);
    }
}
