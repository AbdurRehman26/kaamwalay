<?php

namespace App\Http\Resources\API\Customer\Order\PaymentMethod;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PaymentMethodCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}