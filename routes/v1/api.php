<?php

use App\Http\Controllers\API\V1\Auth\ChangePasswordController;
use App\Http\Controllers\API\V1\Auth\ForgotPasswordController;
use App\Http\Controllers\API\V1\Auth\LoginController;
use App\Http\Controllers\API\V1\Auth\ResetPasswordController;
use App\Http\Controllers\API\V1\ConfigurationsController;
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
    Route::post('password/forgot', [ForgotPasswordController::class, 'sendResetLinkEmail'])->middleware('throttle:5');
    Route::post('password/reset', [ResetPasswordController::class, 'reset']);
    Route::post('password/change', [ChangePasswordController::class, 'change']);
    Route::middleware('auth')->get('me', [LoginController::class, 'me'])->name('auth.me');
});

Route::prefix('configurations')->group(function () {
    Route::post('/', [ConfigurationsController::class, 'getConfigurations']);
    Route::delete('/', [ConfigurationsController::class, 'purgeConfigurations'])->middleware('auth');
});
