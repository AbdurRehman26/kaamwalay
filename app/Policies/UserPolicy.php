<?php


namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function sendAcessEmail(User $user, User $customer): bool
    {
        return $user->isAdmin() && ! $customer->last_login_at;
    }
}
