<?php

namespace App\Http\Resources\API\Customer\Order\Invoice;

use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'path' => $this->path,
        ];
    }
}
