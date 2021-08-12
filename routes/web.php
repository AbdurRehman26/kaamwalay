<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use App\Services\PDFService;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [HomeController::class, 'getView'])->name('home');
Route::get('/admin{path}', [AdminController::class, 'getView'])->where(['path' => '.*'])->name('admin.main');
Route::get('/auth{path}', [AuthController::class, 'getView'])->where(['path' => '.*'])->name('auth.main');
Route::get('/dashboard{path}', [DashboardController::class, 'getView'])->where(['path' => '.*'])->name('dashboard.main');

Route::get('/invoice', function(Request $request){
    $logoContent = file_get_contents(resource_path('assets/logos/invoiceLogo.png'));
    $logoData = 'data:image/png;base64,'.base64_encode($logoContent);

    $agsLogoContent = file_get_contents(resource_path('assets/logos/agsLogo.png'));
    $agsLogo = 'data:image/png;base64,'.base64_encode($agsLogoContent);

    return view('pdf.invoice',compact('logoData','agsLogo'));
});

Route::get('/invoice2', function(Request $request){
    $logoContent = file_get_contents(resource_path('assets/logos/invoiceLogo.png'));
    $logoData = 'data:image/png;base64,'.base64_encode($logoContent);

    $agsLogoContent = file_get_contents(resource_path('assets/logos/agsLogo.png'));
    $agsLogo = 'data:image/png;base64,'.base64_encode($agsLogoContent);

    $order = \App\Models\Order::find(12);
    $orderItems = $order->orderItems;
    $customer = $order->user;
    $shippingAddress = $order->shippingAddress;
    $billingAddress = $order->billingAddress;
    $orderPayment = $order->orderPayment;
    $paymentResponse = $orderPayment ? json_decode($orderPayment->response) : null;
    if($paymentResponse){
        $orderPayment = json_decode(json_encode([
            'card' => [
                'brand' => $paymentResponse->card->brand,
                'exp_month' => \Str::padLeft($paymentResponse->card->exp_month,2,'0'),
                'exp_year' => substr($paymentResponse->card->exp_year,2),
                'last4' => $paymentResponse->card->last4,
            ],
        ]));
    }
    $data = [
        'logoData' => $logoData,
        'agsLogo' => $agsLogo,
        'order' => $order,
        'orderItems' => $orderItems,
        'customer' => $customer,
        'shippingAddress' => $shippingAddress,
        'orderPayment' => $orderPayment,
        'billingAddress' => $billingAddress,
    ];

    $pdf = PDFService::generate('pdf.invoice',$data);
    return $pdf->stream();
    // return $pdf->download('test.pdf');

});