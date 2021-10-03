<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use Illuminate\View\View;

class TermsAndConditionsController extends Controller
{
    public function __invoke(): View
    {
        return view('landings.terms-and-conditions');
    }
}
