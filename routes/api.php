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
