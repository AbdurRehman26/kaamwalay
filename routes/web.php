<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Landings\FeedController;
use App\Http\Controllers\Landings\PopReportController;
use App\Http\Controllers\Landings\TermsAndConditionsController;
use App\Http\Controllers\SalesRepController;
use App\Http\Controllers\Landings\ReferralController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [HomeController::class, 'getView'])->name('home');
Route::get('/admin{path}', [AdminController::class, 'getView'])->where(['path' => '.*'])->name('admin.main');
Route::get('/dashboard{path}', [DashboardController::class, 'getView'])->where(['path' => '.*'])->name('dashboard.main');
Route::get('/salesrep{path}', [SalesRepController::class, 'getView'])->where(['path' => '.*'])->name('salesrep.main');

Route::prefix('auth')->group(function () {
    Route::get('/password/reset', [AuthController::class, 'getView'])->where(['path' => '.*'])->name('password.reset');
    Route::get('sign-in', [AuthController::class, 'getView'])->name('login');
    Route::get('{path}', [AuthController::class, 'getView'])->where(['path' => '.*'])->name('auth.main');
});

Route::prefix('feed')->group(function () {
    Route::get('/', [FeedController::class, 'getList'])->name('feed.list');
    Route::get('/{certificateId}/view', [FeedController::class, 'getView'])->name('feed.view');
});

Route::prefix('pop')->group(function () {
    Route::get('/', [PopReportController::class, 'index'])->name('pop.report');
    Route::get('/categories/{cardCategory}', [PopReportController::class, 'getSeriesReport'])->name('pop.categories');
    Route::get('/categories/{cardCategory}/series/{cardSeries:id}', [PopReportController::class, 'getSetsReport'])->name('pop.series');
    Route::get('/categories/{cardCategory}/series/{cardSeries:id}/sets/{cardSet:id}', [PopReportController::class, 'getCardsReport'])->name('pop.set');
});

Route::get('card/{certificateId}', [FeedController::class, 'cardRedirect'])->name('feed.cardView');
Route::get('/terms-and-conditions', TermsAndConditionsController::class);

Route::get('referral/{code}', [ReferralController::class, 'getReferralPage'])->name('referral');
