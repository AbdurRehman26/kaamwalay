<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class HomeController extends Controller
{
    public function getView(): View
    {
        return view('landings.home.view');
    }
}
