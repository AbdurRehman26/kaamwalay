<?php

namespace App\Http\Controllers;

use App\Events\API\Customer\Order\OrderRefunded;
use App\Models\OrderPayment;
use Illuminate\Http\RedirectResponse;

class HomeController extends Controller
{
    public function getView(): RedirectResponse
    {
        OrderRefunded::dispatch(OrderPayment::find(1)->order, ['amount' => 500]);
        dd(1);
        return redirect()->route('dashboard.main', ['path' => '/']);
    }
}
