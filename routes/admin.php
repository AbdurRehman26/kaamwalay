<?php

use App\Http\Controllers\API\Admin\Cards\CardProductController;
use App\Http\Controllers\API\Admin\Cards\CardSeriesController;
use App\Http\Controllers\API\Admin\Cards\CardSetController;
use App\Http\Controllers\API\Admin\Coupon\ChangeCouponStatus;
use App\Http\Controllers\API\Admin\Coupon\CouponController;
use App\Http\Controllers\API\Admin\Coupon\ListCouponApplicable;
use App\Http\Controllers\API\Admin\Order\OrderController;
use App\Http\Controllers\API\Admin\Order\OrderItemController;
use App\Http\Controllers\API\Admin\Order\OrderPaymentController;
use App\Http\Controllers\API\Admin\Order\OrderRefundController;
use App\Http\Controllers\API\Admin\Order\UserCardController;
use App\Http\Controllers\API\Auth\Admin\LoginController;
use App\Http\Controllers\API\Admin\OrderStatusHistoryController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Admin\Order\OrderExtraChargeController;

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
        Route::get('sets', [CardSetController::class, 'index']);
        Route::get('series', [CardSeriesController::class, 'index']);
        Route::post('/', [CardProductController::class, 'store']);
        Route::get('options', [CardProductController::class, 'getOptionsValues']);
    });

    // Coupons
    Route::apiResource('coupons', CouponController::class)->except('update');
    Route::put('coupons/{coupon}/change-status', ChangeCouponStatus::class)
        ->name('coupons.change-status');
    Route::get('coupon-applicables', ListCouponApplicable::class)->name('coupon.applicables');
});
