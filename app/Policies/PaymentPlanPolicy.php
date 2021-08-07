<?php

namespace App\Policies;

use App\Models\PaymentPlan;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PaymentPlanPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PaymentPlan  $paymentPlan
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, PaymentPlan $paymentPlan)
    {
        return true;
    }
}
