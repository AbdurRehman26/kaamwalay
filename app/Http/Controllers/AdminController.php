<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class AdminController extends Controller
{
    public function getView(): View
    {
        return view('admin');
    }
}
