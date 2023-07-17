<?php

use App\Http\Controllers\API\V3\Salesman\CustomerController;
use App\Http\Controllers\API\V3\Salesman\Order\OrderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Salesman API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for admin APIs. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group with global prefix of
| api/admin.
|
*/

Route::middleware(['auth', 'role:salesman'])->group(function () {

    Route::apiResource('orders', OrderController::class)
        ->only(['show', 'store'])
        ->names([
            'show' => 'salesman.orders.show',
            'store' => 'salesman.orders.store',
        ]);

    Route::prefix('orders')->group(function () {
        Route::prefix('{order}')->group(function () {
            Route::put('update-shipping-address', [OrderController::class, 'updateShippingAddress'])->name('orders.update-shipping-address');
        });
    });
    Route::prefix('customer')->group(function () {
        Route::put('/{user}', [CustomerController::class, 'update'])->name('customer.update');
    });
});
