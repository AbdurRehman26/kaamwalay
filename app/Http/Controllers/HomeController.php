<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;

class HomeController extends Controller
{
    public function getView(): RedirectResponse
    {
        return redirect()->route('dashboard.main', ['path' => '/']);
    }
}
