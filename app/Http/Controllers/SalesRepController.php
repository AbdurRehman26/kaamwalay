<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class SalesRepController extends Controller
{
    public function getView(): View
    {
        return view('salesrep');
    }
}
