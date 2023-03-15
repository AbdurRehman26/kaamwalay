<?php

namespace App\Http\Resources\API\V2\Salesman;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Salesman\User\UserResource;
use App\Models\SalesmanCommissionPayment;
use Illuminate\Http\Request;

/**
 * @mixin SalesmanCommissionPayment
 */
class SalesmanCommissionPaymentResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array <string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'salesman' => $this->whenLoaded('salesman', SalesmanResource::class),
            'added_by' => $this->whenLoaded('addedBy', UserResource::class),
            'amount' => $this->amount,
            'file_url' => $this->file_url,
            'notes' => $this->notes ?? '',
            'created_at' => $this->formatDate($this->created_at),
        ];
    }
}
