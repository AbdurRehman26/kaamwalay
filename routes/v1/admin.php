<?php

use App\Http\Controllers\API\V1\Admin\Cards\CardCategoryController;
use App\Http\Controllers\API\V1\Admin\Cards\CardProductController;
use App\Http\Controllers\API\V1\Admin\Cards\CardSeriesController;
use App\Http\Controllers\API\V1\Admin\Cards\CardSetController;
use App\Http\Controllers\API\V1\Admin\Coupon\CouponableEntityController;
use App\Http\Controllers\API\V1\Admin\Coupon\CouponApplicableController;
use App\Http\Controllers\API\V1\Admin\Coupon\CouponController;
use App\Http\Controllers\API\V1\Admin\Coupon\CouponStatusController;
use App\Http\Controllers\API\V1\Admin\CustomerController;
use App\Http\Controllers\API\V1\Admin\DataExportController;
use App\Http\Controllers\API\V1\Admin\Order\OrderController;
use App\Http\Controllers\API\V1\Admin\Order\OrderExtraChargeController;
use App\Http\Controllers\API\V1\Admin\Order\OrderItemController;
use App\Http\Controllers\API\V1\Admin\Order\OrderPaymentController;
use App\Http\Controllers\API\V1\Admin\Order\OrderRefundController;
use App\Http\Controllers\API\V1\Admin\Order\UserCardController;
use App\Http\Controllers\API\V1\Admin\OrderStatusHistoryController;
use App\Http\Controllers\API\V1\Admin\Wallet\CustomerWalletController;
use App\Http\Controllers\API\V1\Auth\Admin\LoginController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for admin APIs. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group with global prefix of
| api/admin.
|
*/

Route::post('auth/login', LoginController::class)->middleware('guest');
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::apiResource('orders', OrderController::class)->only(['index', 'show']);
    Route::prefix('orders/{order}')->group(function () {
        Route::post('items/bulk/change-status', [OrderItemController::class, 'changeStatusBulk']);
        Route::post('items/{orderItem}/change-status', [OrderItemController::class, 'changeStatus']);
        Route::apiResource('status-history', OrderStatusHistoryController::class)->only(['index', 'store']);

        // TODO: move to resource controller
        Route::put('notes', [OrderController::class, 'updateNotes']);
        Route::put('items/{orderItem}', [OrderItemController::class, 'update']);
        Route::get('items', [OrderItemController::class, 'getOrderCards']);
        Route::post('items', [OrderItemController::class, 'store']);
        Route::put('items/{orderItem}/notes', [OrderItemController::class, 'updateNotes'])
            ->name('update.orderItem.notes');
        Route::get('grades', [OrderController::class, 'getGrades']);
        Route::post('shipment', [OrderController::class, 'updateShipment']);

        Route::put('cards/{card}/grades', [UserCardController::class, 'updateGradingValues']);

        Route::apiResource('order-payments', OrderPaymentController::class)->only('update');
        Route::post('payments/extra-charge', OrderExtraChargeController::class)
            ->name('payments.extra-charge');
        Route::post('payments/refund', OrderRefundController::class)->name('payments.refund');
    });

    Route::prefix('cards')->group(function () {
        Route::apiResource('sets', CardSetController::class)->only(['index', 'store']);

        Route::apiResource('series', CardSeriesController::class)->only(['index', 'store']);

        Route::get('categories', [CardCategoryController::class, 'index']);

        Route::post('/', [CardProductController::class, 'store']);
        Route::get('options/{cardCategory}', [CardProductController::class, 'getOptionsValues']);
    });

    // Coupons
    Route::apiResource('coupons', CouponController::class)->except('update');
    Route::put('coupons/{coupon}/change-status', CouponStatusController::class)
        ->name('coupons.change-status');
    Route::get('coupon-applicables', CouponApplicableController::class)->name('coupon.applicables');
    Route::get('couponable/entities', CouponableEntityController::class)->name('couponable.entities');
  
    
    // Customers
    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
  
    // wallet
    Route::prefix('wallets')->group(function () {
        Route::get('{wallet}', [CustomerWalletController::class, 'show'])
            ->name('customer.wallet.show');
        Route::post('{wallet}/credit', [CustomerWalletController::class, 'creditToWallet'])
            ->name('customer.wallet.credit');
        Route::get('{wallet}/history', [CustomerWalletController::class, 'getTransactionsHistory'])
            ->name('customer.wallet.history');
    });

    Route::post('export-data', DataExportController::class)->name('export-data');
});
