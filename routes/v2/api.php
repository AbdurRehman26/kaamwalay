<?php

use App\Http\Controllers\API\V1\Auth\ChangePasswordController;
use App\Http\Controllers\API\V2\Auth\ForgotPasswordController;
use App\Http\Controllers\API\V2\Auth\LoginController;
use App\Http\Controllers\API\V2\Auth\RegisterController;
use App\Http\Controllers\API\V2\Auth\ResetPasswordController;
use App\Http\Controllers\API\V2\ConfigurationsController;
use App\Http\Controllers\API\V2\Customer\Address\CustomerAddressController;
use App\Http\Controllers\API\V2\Customer\Address\StateController;
use App\Http\Controllers\API\V2\Customer\Cards\CardCategoryController;
use App\Http\Controllers\API\V2\Customer\Cards\CardProductController;
use App\Http\Controllers\API\V2\Customer\Cards\UserCardController;
use App\Http\Controllers\API\V2\Customer\CouponController;
use App\Http\Controllers\API\V2\Customer\Order\OrderController;
use App\Http\Controllers\API\V2\Customer\Order\OrderPaymentController;
use App\Http\Controllers\API\V2\Customer\Order\PaymentMethodController;
use App\Http\Controllers\API\V2\Customer\Order\PaymentPlanController;
use App\Http\Controllers\API\V2\Customer\Order\ShippingFeeController;
use App\Http\Controllers\API\V2\Customer\Order\ShippingMethodController;
use App\Http\Controllers\API\V2\Customer\PaymentCardController;
use App\Http\Controllers\API\V2\Customer\ProfileController;
use App\Http\Controllers\API\V2\Customer\PushNotificationController;
use App\Http\Controllers\API\V2\Customer\Wallet\WalletController;
use App\Http\Controllers\API\V2\Files\UploadController;
use App\Http\Controllers\API\V2\Landings\PopReportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('auth')->group(function () {
    Route::post('login', [LoginController::class, 'login'])->middleware('guest');
    Route::post('login/ags', [LoginController::class, 'authenticateAndUpdateAgsUserToken'])->middleware('auth');
    Route::post('register', [RegisterController::class, 'register'])->middleware('guest');
    Route::post('password/forgot', [ForgotPasswordController::class, 'sendResetLinkEmail'])->middleware('throttle:5');
    Route::post('password/reset', [ResetPasswordController::class, 'reset']);
    Route::post('password/change', [ChangePasswordController::class, 'change']);
    Route::get('me', [LoginController::class, 'me'])->middleware('auth');
});

Route::prefix('customer')->group(function () {
    Route::apiResource('addresses/states', StateController::class)->only(['index', 'show']);
    Route::prefix('orders')->group(function () {
        Route::apiResource('payment-methods', PaymentMethodController::class)->only(['index', 'show']);
        Route::apiResource('payment-plans', PaymentPlanController::class)->only(['index', 'show']);
        Route::post('shipping-fee', ShippingFeeController::class);
    });
    Route::prefix('cards')->group(function () {
        Route::get('categories', CardCategoryController::class)->name('cards.categories');
    });
    Route::middleware('auth')->group(function () {
        Route::apiResource('addresses', CustomerAddressController::class)
            ->only(['index', 'show']);

        Route::post('payment-cards/setup', [PaymentCardController::class, 'createSetupIntent']);
        Route::get('payment-cards', [PaymentCardController::class, 'index']);

        Route::prefix('orders')->group(function () {
            Route::apiResource('shipping-methods', ShippingMethodController::class)->only(['index', 'show']);
            Route::post('{order}/payments', [OrderPaymentController::class, 'process']);
            Route::get('{orderId}', [OrderController::class, 'show']);
            Route::post('{order}/payments', [OrderPaymentController::class, 'process']);
            Route::post('{order}/payments/{paymentIntentId}', [OrderPaymentController::class, 'verify']);
            Route::post('{order}/customer-shipment', [OrderController::class, 'updateCustomerShipment']);

            Route::get('{order}/collector-coin', [OrderController::class, 'calculateCollectorCoinPrice']);
            Route::delete('{order}', [OrderController::class, 'destroy'])->name('customer.orders.destroy');
            Route::get('{orderId}', [OrderController::class, 'show']);
            Route::post('{order}/complete-submission', [OrderController::class, 'completeOrderSubmission']);
            Route::apiResource('', OrderController::class)
                ->only(['index', 'store'])
                ->names([
                    'index' => 'customer.orders.index',
                    'store' => 'customer.orders.store',
                ]);
        });
        Route::prefix('coupons')->group(function () {
            Route::get('{coupon:code}', [CouponController::class, 'show'])->name('coupon.verify');
            Route::post('calculate-discount', [CouponController::class, 'calculateDiscount'])->name('coupon.discount');
        });

        Route::prefix('cards')->group(function () {
            Route::get('/', [UserCardController::class, 'index']);
            Route::get('/{userCard}', [UserCardController::class, 'show']);

            Route::post('/', [CardProductController::class, 'store']);
        });
        Route::put('profile', [ProfileController::class, 'update']);
        Route::get('push-notifications/auth', [PushNotificationController::class, 'auth']);

        Route::prefix('wallet')->group(function () {
            Route::get('transactions', [WalletController::class, 'getTransactions'])->name('wallet.transactions');
            Route::get('/', [WalletController::class, 'getWallet'])->name('wallet.me');
        });
    });
});

Route::prefix('configurations')->group(function () {
    Route::post('/', [ConfigurationsController::class, 'getConfigurations']);
    Route::delete('/', [ConfigurationsController::class, 'purgeConfigurations'])->middleware('auth');
});

Route::prefix('files')->group(function () {
    Route::middleware('auth')->group(function () {
        Route::post('presign', [UploadController::class, 'presignUpload']);
    });
});

Route::prefix('pop')->group(function () {
    Route::get('/categories', [PopReportController::class, 'getCategories']);
    Route::get('/categories/{cardCategory}', [PopReportController::class, 'getSeriesReport']);
    Route::get('/categories/{cardCategory}/series/{cardSeries:id}', [PopReportController::class, 'getSetsReport']);
    Route::get('/categories/{cardCategory}/series/{cardSeries:id}/sets/{cardSet:id}', [PopReportController::class, 'getCardsReport']);
});
