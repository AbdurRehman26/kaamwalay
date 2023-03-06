<?php

namespace App\Http\Resources\API\V2\Salesman\Order;

use App\Models\OrderCertificate;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin OrderCertificate */
class OrderCertificateResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'path' => $this->path,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
