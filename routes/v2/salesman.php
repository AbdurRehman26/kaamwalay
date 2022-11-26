<?php

/*
|--------------------------------------------------------------------------
| Salesman API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for salesman APIs. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group with global prefix of
| api/salesman.
|
*/

use App\Http\Controllers\API\V2\Admin\Salesman\SalesmanDashboardController;
use App\Http\Controllers\API\V2\Salesman\CustomerController;
use App\Http\Controllers\API\V2\Salesman\Order\OrderController;
use App\Http\Controllers\API\V2\Salesman\Order\PaymentMethodController;
use App\Http\Controllers\API\V2\Salesman\Order\PaymentPlanController;
use App\Http\Controllers\API\V2\Salesman\Order\ShippingFeeController;
use App\Http\Controllers\API\V2\Salesman\Order\ShippingMethodController;
use App\Http\Controllers\API\V2\Salesman\SalesmanCommissionPaymentController;
use App\Http\Controllers\API\V2\Salesman\Address\CustomerAddressController;
use App\Http\Controllers\API\V2\Salesman\Wallet\CustomerWalletController;

Route::middleware(['auth', 'role:salesman'])->group(function () {
    Route::post('get-stat', [SalesmanDashboardController::class, 'getStat'])
        ->name('salesman.dashboard.get-stat');

    Route::get('commission-payments', [SalesmanCommissionPaymentController::class, 'index'])
        ->name('salesman.commission-payments.index');

    Route::prefix('orders')->group(function () {
        Route::apiResource('payment-methods', PaymentMethodController::class)->only(['index', 'show'])->names([
            'index' => 'salesman.payment-methods.index',
            'show' => 'salesman.payment-methods.show',
        ]);
        Route::apiResource('payment-plans', PaymentPlanController::class)->only(['index', 'show'])->names([
            'index' => 'salesman.payment-plans.index',
            'show' => 'salesman.payment-plans.show',
        ]);
        Route::apiResource('shipping-methods', ShippingMethodController::class)->only(['index', 'show'])->names([
            'index' => 'salesman.shipping-methods.index',
            'show' => 'salesman.shipping-methods.show',
        ]);
        Route::post('shipping-fee', ShippingFeeController::class);
    });

    Route::apiResource('orders', OrderController::class)
        ->only(['index', 'show', 'store'])
        ->names([
            'index' => 'salesman.orders.index',
            'show' => 'salesman.orders.show',
            'store' => 'salesman.orders.store',
        ]);

    Route::apiResource('customers', CustomerController::class)->only(['index', 'store', 'show'])
        ->names([
            'index' => 'salesman.customers.index',
            'store' => 'salesman.customers.store',
            'show' => 'salesman.customers.show',
        ]);

    Route::get('customer/{user}/addresses', [CustomerAddressController::class, 'getCustomerAddresses']);

    Route::prefix('wallets')->group(function () {
        Route::get('{wallet}', [CustomerWalletController::class, 'show'])
            ->name('salesman.wallet.show');
        Route::post('{wallet}/credit', [CustomerWalletController::class, 'creditToWallet'])
            ->name('salesman.wallet.credit');
        Route::get('{wallet}/history', [CustomerWalletController::class, 'getTransactionsHistory'])
            ->name('salesman.wallet.history');
    });
});
