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

use App\Http\Controllers\API\V2\Admin\Address\CountryController;
use App\Http\Controllers\API\V2\Admin\Address\StateController;
use App\Http\Controllers\API\V2\Admin\Cards\CardCategoryController;
use App\Http\Controllers\API\V2\Admin\Cards\CardProductController;
use App\Http\Controllers\API\V2\Admin\Cards\CardRarityController;
use App\Http\Controllers\API\V2\Admin\Cards\CardSeriesController;
use App\Http\Controllers\API\V2\Admin\Cards\CardSetController;
use App\Http\Controllers\API\V2\Admin\Cards\CardSurfaceController;
use App\Http\Controllers\API\V2\Admin\Salesman\SalesmanDashboardController;
use App\Http\Controllers\API\V2\Salesman\Coupon\CouponController;
use App\Http\Controllers\API\V2\Salesman\Coupon\CouponStatusController;
use App\Http\Controllers\API\V2\Salesman\Coupon\CouponApplicableController;
use App\Http\Controllers\API\V2\Salesman\Coupon\CouponableEntityController;
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

    Route::apiResource('coupons', CouponController::class)->except('update')->names([
        'index' => 'salesman.coupons.index',
        'show' => 'salesman.coupons.show',
        'store' => 'salesman.coupons.store',
        'destroy' => 'salesman.coupons.destroy',
        'verify' => 'salesman.coupons.verify',
        'calculateDiscountForOrder' => 'salesman.coupons.calculateDiscountForOrder',
        'calculateDiscount' => 'salesman.coupons.calculateDiscount',
    ]);;
    Route::put('coupons/{coupon}/change-status', CouponStatusController::class)
        ->name('salesman.coupons.change-status');
    Route::get('coupon-applicables', CouponApplicableController::class)->name('salesman.coupon.applicables');
    Route::get('couponable/entities', CouponableEntityController::class)->name('salesman.couponable.entities');
    Route::prefix('coupons')->group(function () {
        Route::get('verify/{coupon:code}', [CouponController::class, 'verify'])->name('salesman.coupon.verify');
        Route::post('calculate-discount', [CouponController::class, 'calculateDiscount'])->name('salesman.coupon.discount');
    });

    Route::prefix('addresses')->group(function () {
        Route::apiResource('countries', CountryController::class)->only(['index'])->names([
            'index' => 'salesman.countries.index',
        ]);
        Route::apiResource('states', StateController::class)->only(['index'])->names([
            'index' => 'salesman.states.index',
        ]);
    });

    Route::prefix('cards')->group(function () {
        Route::get('categories', [CardCategoryController::class, 'index']);
        Route::apiResource('series', CardSeriesController::class)->only(['index', 'store'])->names([
            'index' => 'salesman.series.index',
            'store' => 'salesman.series.store',
        ]);
        Route::apiResource('sets', CardSetController::class)->only(['index', 'store'])->names([
            'index' => 'salesman.sets.index',
            'store' => 'salesman.sets.store'
        ]);
        Route::get('options/{cardCategory}', [CardProductController::class, 'getOptionsValues']);
        Route::post('/', [CardProductController::class, 'store'])->name('salesman.card-products.store');
    });


});
