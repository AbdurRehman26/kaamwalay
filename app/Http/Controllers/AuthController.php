<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class AuthController extends Controller
{
    public function getView(): View
    {
        return view('auth');
    }
}
