<?php

use App\Http\Controllers\API\V3\Customer\Order\OrderController;
use App\Http\Controllers\API\V3\Customer\Order\PaymentPlanController;
use App\Http\Controllers\API\V3\Customer\PushNotificationController;

Route::prefix('customer')->group(function () {
    Route::prefix('orders')->group(function () {
        Route::apiResource('payment-plans', PaymentPlanController::class)->only(['index', 'show']);
    });

    Route::middleware('auth')->group(function () {
        Route::prefix('orders')->group(function () {
            Route::post('/', [OrderController::class, 'store'])->name('customer.orders.store');
        });

        Route::prefix('push-notifications')->group(function () {
            Route::get('/', [PushNotificationController::class, 'index'])->name('customer.push-notifications.index');
            Route::get('stats', [PushNotificationController::class, 'stats'])->name('customer.push-notifications.stats');
            Route::post('{notification}/mark-as-read', [PushNotificationController::class, 'markAsRead'])->name('customer.push-notifications.mark-as-read');
            Route::post('mark-all-as-read', [PushNotificationController::class, 'markAllAsRead'])->name('customer.push-notifications.mark-all-as-read');
        });
    });
});
