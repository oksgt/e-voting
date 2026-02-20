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

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Route::resource('users', UserController::class);
    Route::resource('users', UserController::class)
        ->only(["create", "store"])->middleware("permission:users.create");

    Route::resource('users', UserController::class)
        ->only(["edit", "update"])->middleware("permission:users.edit");

    Route::resource('users', UserController::class)
        ->only(["destroy"])->middleware("permission:users.delete");

    Route::resource('users', UserController::class)
        ->only(["index", "show"])->middleware("permission:users.view|users.create|users.edit|users.delete");

    //roles permissions
    Route::resource('roles', RoleController::class)
        ->only(["create", "store"])->middleware("permission:roles.create");

    Route::resource('roles', RoleController::class)
        ->only(["edit", "update"])->middleware("permission:roles.edit");

    Route::resource('roles', RoleController::class)
        ->only(["destroy"])->middleware("permission:roles.delete");

    Route::resource('roles', RoleController::class)
        ->only(["index", "show"])->middleware("permission:roles.view|roles.create|roles.edit|roles.delete");
});

require __DIR__ . '/settings.php';
