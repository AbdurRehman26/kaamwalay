<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    public function viewAny()
    {
        return true;
    }

    public function view(User $user, Order $order)
    {
        return $user->isAdmin() || $order->user()->is($user);
    }

    public function create(User $user)
    {
        return true;
    }

    public function update(User $user, Order $order)
    {
        //
    }

    public function review(User $user)
    {
        return $user->isAdmin();
    }
}
