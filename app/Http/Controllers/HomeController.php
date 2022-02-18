<?php

namespace App\Http\Controllers;

use App\Models\CardCategory;
use App\Models\PaymentPlan;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function getView(): View
    {
        $categories = CardCategory::query()->latest()->limit(8)->get();
        $services = PaymentPlan::query()->orderBy('display_position')->get();

        return view('landings.home.view', compact('categories', 'services'));
    }
}
