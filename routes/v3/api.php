<?php

use App\Http\Controllers\API\V3\Customer\Order\PaymentPlanController;

Route::prefix('customer')->group(function () {
    Route::prefix('orders')->group(function () {
        Route::apiResource('payment-plans', PaymentPlanController::class)->only(['index', 'show']);
    });
});
