<?php

namespace App\Http\Controllers;

use App\Models\ElectionEvent;
use Illuminate\Http\Request;
use App\Models\ElectionEventLog;
use App\Models\Position;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ElectionEventLogController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'event_id'   => 'required|integer|exists:election_events,id',
                'user_id'    => 'required|integer|exists:users,id',
                'positions'  => 'required|array',
                'positions.*.position_id' => 'required|integer|exists:positions,id',
                'positions.*.voted_by'    => 'required|integer|exists:users,id',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Override default 422 → kirim 200 dengan payload error
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $e->errors(),
            ], 200);
        }

        // Step 1: cek status event & tanggal
        $event = ElectionEvent::findOrFail($validated['event_id']);

        if ($event->status !== 'running') {
            return response()->json([
                'success' => false,
                'message' => 'Event tidak sedang berjalan',
            ], 200);
        }

        $now = Carbon::now();
        if (!($now->between($event->started_at, $event->finished_at))) {
            return response()->json([
                'success' => false,
                'message' => 'Event sudah berakhir atau belum dimulai',
            ], 200);
        }

        // Step 2: cegah user update jika sudah submit semua posisi aktif
        $submittedCount = ElectionEventLog::where('event_id', $validated['event_id'])
            ->where('user_id', $validated['user_id'])
            ->count();

        $totalPositions = Position::where('status', 1)->count();

        if ($submittedCount >= $totalPositions) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah mengisi semua posisi aktif, tidak bisa memilih lagi',
            ], 200);
        }

        // Jika lolos validasi, simpan log
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

    public function checkParticipation(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|integer|exists:election_events,id',
            'user_id'  => 'required|integer|exists:users,id',
        ]);

        $event = ElectionEvent::findOrFail($validated['event_id']);
        $now   = Carbon::now();

        // Pastikan event masih aktif
        // if ($event->status !== 'running' || !$now->between($event->started_at, $event->finished_at)) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Event tidak aktif',
        //         'participated' => false,
        //     ], 200);
        // }

        // Hitung posisi aktif
        $totalPositions = Position::where('status', 1)->count();

        // Hitung posisi yang sudah diisi user
        $submittedCount = ElectionEventLog::where('event_id', $validated['event_id'])
            ->where('user_id', $validated['user_id'])
            ->count();

        $participatedFully = $submittedCount >= $totalPositions;

        return response()->json([
            'success' => true,
            'message' => $participatedFully
                ? 'User sudah berpartisipasi penuh'
                : 'User belum berpartisipasi penuh',
            'participated' => $participatedFully,
            'submittedCount' => $submittedCount,
            'totalPositions' => $totalPositions,
        ], 200);
    }

    public function penjaringan($eventId)
    {
        $data = DB::table('election_event_logs as e')
            ->selectRaw('
            e.event_id,
            COUNT(DISTINCT e.user_id) AS jumlah_user_ikut,
            t.total_user,
            ROUND(COUNT(DISTINCT e.user_id) / t.total_user * 100, 2) AS persentase
        ')
            ->crossJoin(DB::raw('(SELECT COUNT(*) AS total_user FROM users u WHERE u.id NOT IN (1)) t'))
            ->where('e.event_id', $eventId)
            ->groupBy('e.event_id', 't.total_user')
            ->get()
            ->map(function ($row) {
                $row->persentase = (float) $row->persentase;
                $row->sisa = 100 - $row->persentase; // tambahkan slice sisa
                return $row;
            });

        return response()->json($data);
    }
}
