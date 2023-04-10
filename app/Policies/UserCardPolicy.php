<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserCard;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserCardPolicy
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

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, UserCard $userCard): bool
    {
        return $user->isAdmin() || $userCard->user()->is($user);
    }
}
