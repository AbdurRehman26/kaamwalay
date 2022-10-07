<?php

namespace App\Http\Controllers\API\V2\Admin\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Admin\Order\PaymentPlan\PaymentPlanCollection;
use App\Http\Resources\API\V2\Admin\Order\PaymentPlan\PaymentPlanResource;
use App\Models\PaymentPlan;
use Illuminate\Support\Facades\Cache;

class PaymentPlanController extends Controller
{
    public function index(): PaymentPlanCollection
    {
        $paymentPlans = Cache::remember(
            'payment_plans',
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
