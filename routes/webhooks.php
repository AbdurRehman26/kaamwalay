<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Webhook Routes
|--------------------------------------------------------------------------
|
| Here is where you can register webhook routes. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned no middleware group with global prefix of webhooks.
|
*/

Route::webhooks('cvat-grades', 'cvat-grades');
