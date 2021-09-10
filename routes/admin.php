<?php

use App\Http\Controllers\API\Admin\Order\OrderController;
use App\Http\Controllers\API\Admin\Order\OrderItemController;
use App\Http\Controllers\API\Admin\Order\UserCardController;
use App\Http\Controllers\API\Auth\Admin\LoginController;
use App\Http\Controllers\OrderStatusHistoryController;
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
        Route::post('cards/{orderItem}/change-status', [OrderItemController::class, 'changeStatus']);
        Route::post('cards/bulk-pending', [OrderItemController::class, 'bulkMarkAsPending']);
        Route::put('cards/{orderItem}', [OrderItemController::class, 'update']);
        Route::put('notes', [OrderController::class, 'updateNotes']);
        Route::get('cards', [OrderItemController::class, 'getOrderCards']);
        Route::post('cards', [OrderItemController::class, 'store']);
        Route::apiResource('status-history', OrderStatusHistoryController::class)->only(['index', 'store']);
    });

    Route::put('user-cards/{userCard}/grades', [UserCardController::class, 'updateGradingValues']);
    Route::put('user-cards/{userCard}/images', [UserCardController::class, 'updateImage']);
    Route::delete('user-cards/{userCard}/images', [UserCardController::class, 'deleteImage']);
});
