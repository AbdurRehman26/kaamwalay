<?php

namespace App\Http\Controllers;


use App\Models\Order;

class SalesRepController extends Controller
{
    public function getView()
    {
        return view('salesrep');
    }
}
