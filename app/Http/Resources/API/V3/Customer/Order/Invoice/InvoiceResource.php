<?php

namespace App\Http\Resources\API\V3\Customer\Order\Invoice;

use App\Http\Resources\API\BaseResource;
use App\Models\Invoice;

/** @mixin Invoice */
class InvoiceResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'path' => $this->path,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
