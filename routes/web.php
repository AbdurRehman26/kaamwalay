<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
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
Route::get('/auth{path}', [AuthController::class, 'getView'])->where(['path' => '.*'])->name('auth.main');
Route::get('/dashboard{path}', [DashboardController::class, 'getView'])->where(['path' => '.*'])->name('dashboard.main');

Route::get('/invoice', function(Request $request){
    $logoContent = file_get_contents(storage_path('app/public/images/invoiceLogo.png'));
    $logoData = 'data:image/png;base64,'.base64_encode($logoContent);

    $agsLogoContent = file_get_contents(storage_path('app/public/images/agsLogo.png'));
    $agsLogo = 'data:image/png;base64,'.base64_encode($agsLogoContent);

    return view('pdf.invoice',compact('logoData','agsLogo'));
});

Route::get('/invoice2', function(Request $request){
    $logoContent = file_get_contents(storage_path('app/public/images/invoiceLogo.png'));
    $logoData = 'data:image/png;base64,'.base64_encode($logoContent);

    $agsLogoContent = file_get_contents(storage_path('app/public/images/agsLogo.png'));
    $agsLogo = 'data:image/png;base64,'.base64_encode($agsLogoContent);

    $data = [
        'logoData' => $logoData,
        'agsLogo' => $agsLogo,
    ];
    $pdf = PDF::loadView('pdf.invoice',$data);
    $pdf->setPaper('A4');
    return $pdf->stream();
    // return $pdf->download('test.pdf');

});