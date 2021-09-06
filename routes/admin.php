<?php
use App\Http\Controllers\API\Admin\Order\OrderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for admin views. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group with global prefix of
| api/admin.
|
*/

//Route::group(function () {
Route::apiResource('orders', OrderController::class)->only(['index', 'show']);
//});
