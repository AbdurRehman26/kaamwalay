<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;

class HomeController extends Controller
{
    public function getView(): RedirectResponse
    {
        return redirect()->route('dashboard.main', [
            'path' => '/',
            'rfsn' => request()->query?->get('rfsn'),
            'rf_test' => request()->query?->get('rf_test'),
        ]);
    }
}
