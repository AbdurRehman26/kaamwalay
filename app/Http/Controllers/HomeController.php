<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;

class HomeController extends Controller
{
    public function getView(): RedirectResponse
    {
        dd(\Carbon\Carbon::now()->subDays(1)->format('Y-m-d'));

        return redirect()->route('dashboard.main', ['path' => '/']);
    }
}
