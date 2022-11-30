<?php

/*
|--------------------------------------------------------------------------
| Salesman API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for salesman APIs. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group with global prefix of
| api/salesman.
|
*/

use App\Http\Controllers\API\V2\Admin\Salesman\SalesmanDashboardController;
use App\Http\Controllers\API\V2\Salesman\SalesmanCommissionPaymentController;

Route::middleware(['auth', 'role:salesman'])->group(function () {
    Route::post('get-stat', [SalesmanDashboardController::class, 'getStat'])
        ->name('salesman.dashboard.get-stat');

    Route::get('commission-payments', [SalesmanCommissionPaymentController::class, 'index'])
        ->name('salesman.commission-payments.index');
});
