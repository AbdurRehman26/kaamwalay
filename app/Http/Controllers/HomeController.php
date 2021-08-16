<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;

class HomeController extends Controller
{
    public function getView(): RedirectResponse
    {
        $redirectTo = app()->environment("production")
            ? "https://agscard.com/robograding"
            : route('dashboard.main', ['path' => '/']);

        return redirect($redirectTo);
    }
}
