<?php

namespace App\Policies\API\Customer\Address;

use App\Models\CustomerAddress;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CustomerAddressPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  User  $user
     * @return Response|bool
     */
    public function viewAny(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  User  $user
     * @param  CustomerAddress  $customerAddress
     * @return Response|bool
     */
    public function view(User $user, CustomerAddress $customerAddress)
    {
        return $user->id === $customerAddress->user_id;
    }
}
