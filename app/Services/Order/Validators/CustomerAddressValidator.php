<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Customer\Order\ErrorInCustomerAddress;
use App\Models\CustomerAddress;

class CustomerAddressValidator
{
    public static function validate(array $data)
    {
        if (! empty($data['customer_address']['id'])) {
            throw_unless(
                CustomerAddress::find($data['customer_address']['id'])->user()->is(auth()->user()),
                ErrorInCustomerAddress::class
            );
        }
    }
}
