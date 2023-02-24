<?php

use App\Http\Controllers\API\V3\Admin\CustomerController;
use App\Http\Controllers\API\V3\Admin\Order\OrderController;
use App\Http\Controllers\API\V3\Admin\Order\PaymentPlanController;
use App\Http\Controllers\API\V3\Admin\ReferralProgramController;
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
    Route::apiResource('orders', OrderController::class)->only(['index', 'show']);

    Route::apiResource('customers', CustomerController::class)->only(['index', 'show'])
        ->names([
            'index' => 'customers.index',
            'show' => 'customers.show',
        ]);

    Route::prefix('customer')->group(function () {
        Route::get('/{user}/referral/sign-ups', [ReferralProgramController::class, 'getSignUps'])->name('customer.referral.sign-ups');
        Route::get('/{user}/referral/commission-earnings', [ReferralProgramController::class, 'getCommissionEarnings'])->name('customer.commission-earnings');
        Route::post('/{user}/referral/get-referrer-stat', [ReferralProgramController::class, 'getReferrerStat'])->name('customer.referral.get-referrer-stat');
        Route::post('/{user}/referral/set-referrers-status', [ReferralProgramController::class, 'setReferrersStatus'])->name('customer.referral.set-referrers-status');
    });

    Route::prefix('referral-program')->group(function () {
        Route::post('get-overview-stat', [ReferralProgramController::class, 'getOverviewStat'])
            ->name('referral-program.get-overview-stat');
        Route::get('referrers', [ReferralProgramController::class, 'listReferrers'])->name('referral-program.referrers');
        Route::get('referees', [ReferralProgramController::class, 'listReferees'])->name('referral-program.referees');
        Route::get('orders', [ReferralProgramController::class, 'listReferralOrders'])->name('referral-program.orders');
    });
});
