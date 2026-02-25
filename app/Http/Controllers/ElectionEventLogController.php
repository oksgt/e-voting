<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ElectionEventLog;
use Carbon\Carbon;

class ElectionEventLogController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id'   => 'required|integer|exists:election_events,id',
            'user_id'    => 'required|integer|exists:users,id',
            'positions'  => 'required|array',
            'positions.*.position_id' => 'required|integer|exists:positions,id',
            'positions.*.voted_by'    => 'required|integer|exists:users,id',
        ]);

        $logs = [];

        foreach ($validated['positions'] as $pos) {
            $log = ElectionEventLog::updateOrCreate(
                [
                    'event_id'    => $validated['event_id'],
                    'user_id'     => $validated['user_id'],
                    'position_id' => $pos['position_id'],
                ],
                [
                    'voted_by' => $pos['voted_by'],
                    'voted_at' => Carbon::now(),
                ]
            );

            $logs[] = $log;
        }

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil disimpan',
            'data'    => $logs,
        ]);
    }
}
