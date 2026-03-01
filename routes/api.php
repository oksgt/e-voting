<?php

use App\Http\Controllers\ElectionEventController;
use App\Http\Controllers\ElectionEventLogController;
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

Route::get('/chart-penjaringan/{eventId}', [ElectionEventLogController::class, 'penjaringan']);
Route::get('/top-2-per-position/{eventId}/{limit?}', [ElectionEventController::class, 'topTwoPerPosition']);

Route::post('/election-event-logs-tahap2', [ElectionEventLogController::class, 'store_tahap2']);

Route::post('/election-event-log/rejection', [ElectionEventLogController::class, 'addRejection']);
Route::post('/election-event-log/rejection/remove', [ElectionEventLogController::class, 'removeRejection']);





