<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use Illuminate\View\View;

class AutographAuthenticationController extends Controller
{
    public function index(): View
    {
        return view('landings.autographAuthentication.view');
    }
}
