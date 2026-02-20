<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/check-phone/{phone}', [UserController::class, 'checkPhoneNumber']);

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Route::resource('users', UserController::class);
    Route::resource('users', UserController::class);

    //roles permissions
    Route::resource('roles', RoleController::class);


});

require __DIR__ . '/settings.php';
