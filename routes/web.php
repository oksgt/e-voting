<?php

use App\Http\Controllers\ElectionEventController;
use App\Http\Controllers\MagicLinksController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VoterController;
use Illuminate\Support\Facades\Response as FacadesResponse;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Response;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/check-phone/{phone}', [UserController::class, 'checkPhoneNumber']);

Route::get('/download/user-template', function () {
    $path = public_path('storage/csv-template/user-template.csv');

    if (!file_exists($path)) {
        abort(404, 'Template file not found.');
    }

    return FacadesResponse::download($path, 'user-template.csv', [
        'Content-Type' => 'text/csv',
    ]);
})->name('download.user-template');

Route::get('/magic-links/generate/{phone_number}', [MagicLinksController::class, 'generateMagicLinks'])
    ->name('magic-links.generate');

Route::get('/magic-login/{token}', [MagicLinksController::class, 'verifyMagicLink'])->name('magic.verify');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Route::resource('users', UserController::class);
    Route::resource('users', UserController::class);
    Route::post('/users/import', [UserController::class, 'importCsv'])->name('users.import');

    Route::resource('voters', VoterController::class);
    Route::post('/voters/import', [UserController::class, 'importCsv'])->name('voters.import');

    Route::resource('positions', PositionController::class);

    Route::resource('events', ElectionEventController::class);

    //roles permissions
    Route::resource('roles', RoleController::class);
});

require __DIR__ . '/settings.php';
