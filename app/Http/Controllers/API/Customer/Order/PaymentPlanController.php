<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanCollection;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Models\PaymentPlan;

class PaymentPlanController extends Controller
{
    public function index(): PaymentPlanCollection
    {
        return new PaymentPlanCollection(PaymentPlan::orderBy('display_position')->get());
    }

    public function show(int $id): PaymentPlanResource
    {
        return new PaymentPlanResource(PaymentPlan::findOrFail($id));
    }
}
