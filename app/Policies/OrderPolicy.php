<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    public function viewAny(): bool
    {
        return true;
    }

    public function view(User $user, Order $order): bool
    {
        return $user->isAdmin() || $order->user()->is($user);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Order $order): bool
    {
        //
    }

    public function review(User $user)
    {
        return $user->isAdmin();
    }

    public function calculateCollectorCoin(User $user, Order $order): bool
    {
        return ($user->isAdmin() || $order->user()->is($user))
        && $order->isPayable('v2');
    }
}
