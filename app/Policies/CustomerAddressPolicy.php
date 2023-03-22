<?php

namespace App\Policies;

use App\Models\CustomerAddress;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CustomerAddressPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CustomerAddress $customerAddress): bool
    {
        return $customerAddress->user->is($user);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }
    /**
     * Determine whether the user can update models.
     */
    public function update(User $user, CustomerAddress $customerAddress): bool
    {
        return $customerAddress->user->is($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CustomerAddress $customerAddress): bool
    {
        return $customerAddress->user->is($user);
    }
}
