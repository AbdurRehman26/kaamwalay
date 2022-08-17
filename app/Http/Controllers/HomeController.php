<?php

namespace App\Http\Controllers;

use App\Jobs\Admin\Order\CreateOrderLabel;
use App\Models\CardCategory;
use App\Models\PaymentPlan;
use Illuminate\Support\Facades\Cache;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function getView(): View
    {
//        CreateOrderLabel::dispatch(\App\Models\Order::find(4209));

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

        return view('landings.home.view', compact('categories', 'services'));
    }
}
