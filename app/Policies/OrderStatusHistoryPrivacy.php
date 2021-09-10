<?php

namespace App\Policies;

use App\Models\OrderStatusHistory;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class OrderStatusHistoryPrivacy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param User $user
     * @return Response|bool
     */
    public function viewAny(User $user): Response|bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param User $user
     * @param OrderStatusHistory $orderStatusHistory
     * @return Response|bool
     */
    public function view(User $user, OrderStatusHistory $orderStatusHistory): Response|bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param User $user
     * @return Response|bool
     */
    public function create(User $user): Response|bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param User $user
     * @param OrderStatusHistory $orderStatusHistory
     * @return Response|bool
     */
    public function update(User $user, OrderStatusHistory $orderStatusHistory): Response|bool
    {
        return true;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param User $user
     * @param OrderStatusHistory $orderStatusHistory
     * @return Response|bool
     */
    public function delete(User $user, OrderStatusHistory $orderStatusHistory): Response|bool
    {
        return true;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param User $user
     * @param OrderStatusHistory $orderStatusHistory
     * @return Response|bool
     */
    public function restore(User $user, OrderStatusHistory $orderStatusHistory): Response|bool
    {
        return true;
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param User $user
     * @param OrderStatusHistory $orderStatusHistory
     * @return Response|bool
     */
    public function forceDelete(User $user, OrderStatusHistory $orderStatusHistory): Response|bool
    {
        return true;
    }
}
