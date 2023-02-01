<?php

use App\Http\Controllers\API\V3\Admin\Order\OrderController;
use App\Http\Controllers\API\V3\Admin\Order\PaymentPlanController;
use App\Http\Controllers\API\V3\Admin\ReferralController;
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

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::prefix('orders')->group(function () {
        Route::apiResource('payment-plans', PaymentPlanController::class)->only(['index', 'show'])->names([
            'index' => 'payment-plans.index',
            'show' => 'payment-plans.show',
        ]);

        Route::post('/', [OrderController::class, 'store'])->name('orders.store');
    });
    Route::prefix('customers')->group(function () {
        Route::get('/{user}/referral/sign-ups', [ReferralController::class, 'getSignUps'])->name('admin.customer.referral.sign-ups');
        Route::get('/{user}/referral/commission-earnings', [ReferralController::class, 'getCommissionEarnings'])->name('admin.customer.commission-earnings');
        Route::post('/{user}/referral/get-stat', [ReferralController::class, 'getStat'])->name('admin.customer.referral.get-stat');
    });
});
