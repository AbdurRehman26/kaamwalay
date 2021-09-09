<?php
use App\Http\Controllers\API\Auth\Admin\LoginController;
use App\Http\Controllers\API\Admin\Order\OrderController;
use App\Http\Controllers\API\Admin\Order\OrderItemController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Admin\Order\UserCardController;

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
    Route::prefix('orders/')->group(function () {
        Route::put('{order}/notes',[OrderController::class, 'updateNotes']);
        Route::get('{order}/cards', [OrderItemController::class, 'getOrderCards']);
        Route::post('{order}/cards/{orderItem}/change-status', [OrderItemController::class, 'changeStatus']);
        Route::post('{order}/cards/bulk-pending', [OrderItemController::class, 'bulkMarkAsPending']);
        Route::post('{order}/complete-review', [OrderController::class, 'completeReview']);
        Route::post('{order}/cards', [OrderItemController::class, 'store']);
        Route::put('{order}/cards/{orderItem}', [OrderItemController::class, 'update']);
    });
    Route::put('user-cards/{userCard}/grades', [UserCardController::class, 'updateGradingValues']);
    Route::put('user-cards/{userCard}/images', [UserCardController::class, 'updateImage']);
    Route::delete('user-cards/{userCard}/images', [UserCardController::class, 'deleteImage']);
});
