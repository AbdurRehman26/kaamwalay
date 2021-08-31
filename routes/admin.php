<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Auth\Admin\LoginController;

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

Route::post('auth/login', LoginController::class)->middleware('guest');
