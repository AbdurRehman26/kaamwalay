<?php

namespace App\Http\Controllers;

use App\Models\CardCategory;
use App\Models\PaymentPlan;
use App\Models\PaymentPlanRange;
use Illuminate\Support\Facades\Cache;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function getView(): View
    {
        $categories = Cache::remember(
            'homepage:card_categories',
            now()->addMonth(),
            fn () => CardCategory::enabled()->get()
        );

        $services = Cache::remember(
            'homepage:payment_plans',
            now()->addMonth(),
            fn () => PaymentPlan::orderBy('display_position')->get()
        );

        $paymentPlanRanges = Cache::remember(
            'homepage:payment_plan_ranges',
            now()->addMonth(),
            fn () => PaymentPlan::join('payment_plan_ranges', 'payment_plan_ranges.payment_plan_id', '=','payment_plans.id')->get()
        );

        return view('landings.home.view', compact('categories', 'services', 'paymentPlanRanges'));
    }
}
