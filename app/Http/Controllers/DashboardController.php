<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class DashboardController extends Controller
{
    public function getView(): View
    {
        return view('dashboard');
    }
}
