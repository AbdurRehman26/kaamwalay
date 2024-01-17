<?php

use App\Http\Controllers\API\V3\Auth\LoginController;
use App\Http\Controllers\API\V3\Auth\RegisterController;
use App\Http\Controllers\API\V3\Customer\CustomerController;
use App\Http\Controllers\API\V3\Customer\Order\OrderController;
use App\Http\Controllers\API\V3\Customer\Order\PaymentPlanController;
use App\Http\Controllers\API\V3\Customer\Order\UpdateOrderShippingMethodController;
use App\Http\Controllers\API\V3\Customer\PushNotificationController;
use App\Http\Controllers\API\V3\Customer\RefereeCouponController;
use App\Http\Controllers\API\V3\Customer\ReferralProgramController;
use App\Http\Controllers\API\V3\Customer\ReferrerPayoutController;

Route::prefix('auth')->group(function () {
    Route::middleware('auth')->get('me', [LoginController::class, 'me'])->name('auth.me');
    Route::post('register', [RegisterController::class, 'register'])->middleware('guest');
});

Route::prefix('customer')->group(function () {
    Route::prefix('orders')->group(function () {
        Route::apiResource('payment-plans', PaymentPlanController::class)->only(['index', 'show']);
    });

    Route::middleware('auth')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('customer.index');

        Route::prefix('orders')->group(function () {
            Route::get('/', [OrderController::class, 'index'])->name('customer.orders.index');
            Route::post('/', [OrderController::class, 'store'])->name('customer.orders.store');
            Route::get('{orderId}', [OrderController::class, 'show'])->name('customer.orders.show');
            Route::delete('{order}', [OrderController::class, 'destroy'])->name('customer.orders.destroy');
            Route::post('{order}/customer-shipment', [OrderController::class, 'updateCustomerShipment'])->name('customer.orders.customer-shipment');
            Route::put('{order}/shipping-method', UpdateOrderShippingMethodController::class)
                ->name('customer.orders.update-shipping-method');
        });

        Route::prefix('push-notifications')->group(function () {
            Route::get('/', [PushNotificationController::class, 'index'])->name('customer.push-notifications.index');
            Route::get('stats', [PushNotificationController::class, 'stats'])->name('customer.push-notifications.stats');
            Route::post('{notification}/mark-as-read', [PushNotificationController::class, 'markAsRead'])->name('customer.push-notifications.mark-as-read');
            Route::post('mark-all-as-read', [PushNotificationController::class, 'markAllAsRead'])->name('customer.push-notifications.mark-all-as-read');
        });

        Route::prefix('referral')->group(function () {
            Route::get('/', [ReferralProgramController::class, 'getReferrerProfile'])->name('customer.referral');
            Route::get('/sign-ups', [ReferralProgramController::class, 'getSignUps'])->name('customer.referral.sign-ups');
            Route::get('commission-earnings', [ReferralProgramController::class, 'getCommissionEarnings'])->name('customer.referral.commission-earnings');
        });

        Route::prefix('referee')->group(function () {
            Route::get('/coupon', [RefereeCouponController::class, 'show'])->name('customer.referee.coupon');
        });

        Route::prefix('referrer')->group(function () {
            Route::apiResource('payouts', ReferrerPayoutController::class)->only(['index', 'store']);
        });

    });

});
