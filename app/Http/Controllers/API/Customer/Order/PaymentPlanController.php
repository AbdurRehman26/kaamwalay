<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanCollection;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Models\PaymentPlan;
use Illuminate\Support\Facades\Cache;

class PaymentPlanController extends Controller
{
    public function index(): PaymentPlanCollection
    {
        $paymentPlans = Cache::remember(
            'payment_methods',
            now()->addWeek(),
            fn () => PaymentPlan::orderBy('display_position')->get()
        );

        return new PaymentPlanCollection($paymentPlans);
    }

    public function show(int $id): PaymentPlanResource
    {
        return new PaymentPlanResource(PaymentPlan::findOrFail($id));
    }
}
