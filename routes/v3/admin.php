<?php

use App\Http\Controllers\API\V3\Admin\Cards\CardCategoryController;
use App\Http\Controllers\API\V3\Admin\Cards\CardCategoryTypeController;
use App\Http\Controllers\API\V3\Admin\CustomerController;
use App\Http\Controllers\API\V3\Admin\Order\OrderController;
use App\Http\Controllers\API\V3\Admin\Order\PaymentPlanController;
use App\Http\Controllers\API\V3\Admin\Order\UserCardController;
use App\Http\Controllers\API\V3\Admin\ReferralProgramController;
use App\Http\Controllers\API\V3\Admin\ReferrerPayoutController;
use App\Http\Controllers\API\V3\Admin\TaggableController;
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

        Route::prefix('{order}')->group(function () {
            Route::put('update-shipping-address', [OrderController::class, 'updateShippingAddress'])->name('orders.update-shipping-address');
            Route::get('grades', [OrderController::class, 'getGrades'])->name('orders.get-grades');
            Route::post('create-folders', [OrderController::class, 'createFolders'])->name('orders.create-folders');
            Route::put('cards/{card}/grades', [UserCardController::class, 'updateGradingValues']);
        });

    });
    Route::apiResource('orders', OrderController::class)->only(['index', 'show'])
        ->names([
            'index' => 'orders.index',
            'show' => 'orders.show',
        ]);

    Route::apiResource('customers', CustomerController::class)->only(['index', 'show'])
        ->names([
            'index' => 'customers.index',
            'show' => 'customers.show',
        ]);

    Route::prefix('cards')->group(function () {
        Route::post('categories', [CardCategoryController::class, 'store'])->name('cards.categories.store');
        Route::get('category-types', [CardCategoryTypeController::class, 'index'])->name('cards.category-types.index');
    });

    Route::prefix('customer')->group(function () {
        Route::get('/{user}/referral/sign-ups', [ReferralProgramController::class, 'getSignUps'])->name('customer.referral.sign-ups');
        Route::get('/{user}/referral/commission-earnings', [ReferralProgramController::class, 'getCommissionEarnings'])->name('customer.commission-earnings');
        Route::post('/{user}/referral/get-referrer-stat', [ReferralProgramController::class, 'getReferrerStat'])->name('customer.referral.get-referrer-stat');
        Route::post('/{user}/referral/set-referrers-status', [ReferralProgramController::class, 'setReferrersStatus'])->name('customer.referral.set-referrers-status');
        Route::put('/{user}', [CustomerController::class, 'update'])->name('customer.update');
    });

    Route::prefix('referral-program')->group(function () {
        Route::apiResource('payouts', ReferrerPayoutController::class)->only(['index', 'store'])
            ->names([
                'index' => 'referral.payouts.index',
                'store' => 'referral.payouts.store',
            ]);
        Route::post('get-overview-stat', [ReferralProgramController::class, 'getOverviewStat'])
            ->name('referral-program.get-overview-stat');
        Route::get('referrers', [ReferralProgramController::class, 'listReferrers'])->name('referral-program.referrers');
        Route::get('referees', [ReferralProgramController::class, 'listReferees'])->name('referral-program.referees');
        Route::get('orders', [ReferralProgramController::class, 'listReferralOrders'])->name('referral-program.orders');
    });

    Route::post('attach-tags', [TaggableController::class, 'attachTags'])->name('attach-tags');
    Route::post('detach-tags', [TaggableController::class, 'detachTags'])->name('detach-tags');
});
