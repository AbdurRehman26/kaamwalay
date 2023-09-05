<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Customer\Order\ErrorInCustomerAddress;
use App\Models\CustomerAddress;

class AdminCustomerAddressValidator
{
    /**
     * @throws \Throwable
     */
    public static function validate(array $data): void
    {
        if (! empty($data['customer_address']['id'])) {
            throw_unless(
                $data['user_id'] === CustomerAddress::find($data['customer_address']['id'])->user_id,
                ErrorInCustomerAddress::class
            );
        }
    }
}
