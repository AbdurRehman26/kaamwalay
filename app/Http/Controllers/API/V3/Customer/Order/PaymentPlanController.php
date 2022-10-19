<?php

namespace App\Http\Controllers\API\V3\Customer\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V3\Customer\Order\PaymentPlan\PaymentPlanCollection;
use App\Http\Resources\API\V3\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Models\PaymentPlan;
use Illuminate\Support\Facades\Cache;

class PaymentPlanController extends Controller
{
    public function index(): PaymentPlanCollection
    {
        $paymentPlans = Cache::remember(
            'v3.payment_plans',
            now()->addMonth(),
            fn () => PaymentPlan::orderBy('display_position')->get()
        );

        return new PaymentPlanCollection($paymentPlans);
    }

    public function show(int $id): PaymentPlanResource
    {
        return new PaymentPlanResource(PaymentPlan::findOrFail($id));
    }
}
