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

Route::middleware(['auth', 'role:salesman'])->group(function () {

    Route::get('dashboard/sales', [SalesmanDashboardController::class, 'getSales'])
        ->name('salesman.dashboard.sales');
    Route::get('dashboard/commission-earned', [SalesmanDashboardController::class, 'getCommissionsEarned'])
        ->name('salesman.dashboard.commission-earned');

});
