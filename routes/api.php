<?php

use App\Http\Controllers\API\Customer\Order\OrderController;
use App\Http\Controllers\API\Customer\Order\PaymentMethodController;
use App\Http\Controllers\API\Customer\Order\ShippingFeeController;
use App\Http\Controllers\API\Customer\Order\ShippingMethodController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Auth\LoginController;
use App\Http\Controllers\API\Auth\RegisterController;
use App\Http\Controllers\API\Customer\Address\StateController;
use App\Http\Controllers\API\Customer\Order\PaymentPlanController;
use App\Http\Controllers\API\Customer\PaymentMethodController as CustomerPaymentMethodController;
use App\Http\Controllers\API\Customer\Address\CustomerAddressController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::prefix('auth')->group(function () {
    Route::post('login', [LoginController::class, 'login'])->middleware('guest');
    Route::post('register', [RegisterController::class, 'register'])->middleware('guest');
    Route::get('me', [LoginController::class, 'me'])->middleware('auth');
});

Route::prefix('customer')->group(function () {
    Route::middleware('auth')->group(function () {
        Route::apiResource('addresses/states', StateController::class);
        Route::apiResource('addresses', CustomerAddressController::class)
            ->only(['index', 'show']);
        Route::post('payment-methods/charge', [CustomerPaymentMethodController::class, 'charge']);
        Route::post('payment-methods/setup', [CustomerPaymentMethodController::class, 'createSetupIntent']);
        Route::get('payment-methods', [CustomerPaymentMethodController::class, 'index']);

        Route::prefix('orders')->group(function () {
            Route::apiResource('payment-plans', PaymentPlanController::class)
                ->only(['index', 'show']);
            Route::post('shipping-fee', ShippingFeeController::class);
            Route::apiResource('shipping-methods', ShippingMethodController::class)->only(['index', 'show']);
            Route::apiResource('payment-methods', PaymentMethodController::class)->only(['index', 'show']);
            Route::get('{order}', [OrderController::class, 'show']);
            Route::apiResource('/', OrderController::class)
                ->only(['index', 'store']);
        });
    });
});
