<?php

namespace App\Services\Salesman\V3;

use App\Models\User;
use App\Services\Salesman\V2\CustomerService as V2CustomerService;

class CustomerService extends V2CustomerService
{
    public function updateCustomer(User $user, array $data): User
    {
        $user->update($data);

        return $user;
    }
}
