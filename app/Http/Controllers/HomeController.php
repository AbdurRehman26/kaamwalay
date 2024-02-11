<?php

namespace App\Http\Controllers;

use App\Models\CardCategory;
use App\Models\PaymentPlan;
use Illuminate\Support\Facades\Cache;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function getView(): View
    {
        return view('landings.home.view');
    }
}
