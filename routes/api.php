<?php

use App\Http\Controllers\ElectionEventController;
use App\Http\Controllers\ElectionEventLogController;
use App\Http\Controllers\VoterController;
use App\Http\Resources\AnggotaKoperasiCollection;
use App\Http\Resources\BidangCollection;
use App\Models\AnggotaKoperasi;
use App\Models\Bidang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/election-events/running', [ElectionEventController::class, 'getRunningEvent']);
Route::get('/election-events/job-positions', [ElectionEventController::class, 'getActivePosition']);
Route::get('/voters', [ElectionEventController::class, 'getVoterList']);

Route::post('/election-event-logs', [ElectionEventLogController::class, 'store']);
Route::post('/election-events/check-participation', [ElectionEventLogController::class, 'checkParticipation']);

Route::get('/chart-penjaringan/{eventId}/{value_type?}', [ElectionEventLogController::class, 'penjaringan']);
Route::get('/top-2-per-position/{eventId}/{limit?}', [ElectionEventController::class, 'topTwoPerPosition']);

Route::post('/election-event-logs-tahap2', [ElectionEventLogController::class, 'store_tahap2']);

Route::get('/bidang', fn () => new BidangCollection(Bidang::query()->get()));
Route::post('/election-event-log/rejection', [ElectionEventLogController::class, 'addRejection']);
Route::post('/election-event-log/rejection/remove', [ElectionEventLogController::class, 'removeRejection']);

Route::get('/top-2-per-position-tahap-2/{eventId}/', [ElectionEventController::class, 'topTwoPerPositionTahap2']);

Route::get('/ranking-tahap-2/{eventId}/', [ElectionEventController::class, 'rankingTahap2']);

Route::get('/anggota', function (Request $request) {
    $query = AnggotaKoperasi::query()
        ->when($request->query('bidang'), fn ($q, $bidang) => $q->where('bidang', $bidang))
        ->where('user_id', null);

    return new AnggotaKoperasiCollection($query->get());
});

Route::post('/check-phone-number/{phone}', [VoterController::class, 'checkPhoneNumber']);
