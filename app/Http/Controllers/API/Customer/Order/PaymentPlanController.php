<?php

namespace App\Http\Controllers\API\Customer\Order;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanCollection;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Models\PaymentPlan;

class PaymentPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return new PaymentPlanCollection(PaymentPlan::orderBy('display_position')->get());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return new PaymentPlanResource(PaymentPlan::findOrFail($id));
    }
}
