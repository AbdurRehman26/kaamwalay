<?php

namespace App\Services;

use App\Models\User;

class CustomerProfileService
{
    public function update(User $user, array $data): User
    {
        $user->update($data);

        return $user;
    }
}
