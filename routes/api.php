<?php

use App\Http\Controllers\API\Customer\Order\ShippingFeeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Auth\LoginController;
use App\Http\Controllers\API\Auth\RegisterController;
use App\Http\Controllers\API\Customer\Address\StateController;
use App\Http\Controllers\API\Customer\Order\PaymentPlanController;
use App\Http\Controllers\API\Customer\Order\PaymentMethodController;
use App\Http\Controllers\API\Customer\Address\CustomerAddressController;
use App\Http\Controllers\API\Auth\ForgotPasswordController;
use App\Http\Controllers\API\Auth\ResetPasswordController;

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
    Route::post('login', [LoginController::class, 'login']);
    Route::post('register', [RegisterController::class, 'register']);
    Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
    Route::post('password/reset', [ResetPasswordController::class, 'reset']);
    Route::get('me', [LoginController::class, 'me'])->middleware('auth');
});

Route::prefix('customer')->group(function () {
    Route::apiResource('/orders/payment-plans', PaymentPlanController::class)
        ->only(['index', 'show']);
    Route::post('/orders/shipping-fee', ShippingFeeController::class);
    Route::apiResource('/addresses/states', StateController::class);
    Route::middleware('auth')->group(function () {
        Route::apiResource('/addresses', CustomerAddressController::class)
            ->only(['index', 'show']);
        Route::get('payment-methods', [PaymentMethodController::class, 'index']);
        Route::post('payment-methods/setup', [PaymentMethodController::class, 'createSetupIntent']);
        Route::post('payment-methods/charge', [PaymentMethodController::class, 'charge']);
    });
});
