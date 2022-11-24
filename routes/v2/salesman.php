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
            'index' => 'admin.payment-methods.index',
            'show' => 'admin.payment-methods.show',
        ]);
        Route::apiResource('payment-plans', PaymentPlanController::class)->only(['index', 'show'])->names([
            'index' => 'admin.payment-plans.index',
            'show' => 'admin.payment-plans.show',
        ]);
        Route::apiResource('shipping-methods', ShippingMethodController::class)->only(['index', 'show'])->names([
            'index' => 'admin.shipping-methods.index',
            'show' => 'admin.shipping-methods.show',
        ]);
        Route::post('shipping-fee', ShippingFeeController::class);
    });

    Route::apiResource('orders', OrderController::class)->only(['index', 'show', 'store', 'destroy']);

    Route::apiResource('customers', CustomerController::class)->only(['index', 'store', 'show'])
        ->names([
            'index' => 'customers.index',
            'store' => 'customers.store',
            'show' => 'customers.show',
        ]);

    Route::get('customer/{user}/addresses', [CustomerAddressController::class, 'getCustomerAddresses']);

    Route::prefix('wallets')->group(function () {
        Route::get('{wallet}', [CustomerWalletController::class, 'show'])
            ->name('customer.wallet.show');
        Route::post('{wallet}/credit', [CustomerWalletController::class, 'creditToWallet'])
            ->name('customer.wallet.credit');
        Route::get('{wallet}/history', [CustomerWalletController::class, 'getTransactionsHistory'])
            ->name('customer.wallet.history');
    });
});
