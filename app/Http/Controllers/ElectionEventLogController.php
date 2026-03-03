<?php

namespace App\Http\Controllers;

use App\Models\ElectionEvent;
use App\Models\ElectionEventLog;
use App\Models\Position;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ElectionEventLogController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'event_id' => 'required|integer|exists:election_events,id',
                'voted_by' => 'required|integer|exists:users,id',
                'positions' => 'required|array',
                'positions.*.position_id' => 'required|integer|exists:positions,id',
                'positions.*.user_id' => 'required|integer|exists:anggota_koperasi,id',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Override default 422 → kirim 200 dengan payload error
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
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
        if (! ($now->between($event->started_at, $event->finished_at))) {
            return response()->json([
                'success' => false,
                'message' => 'Event sudah berakhir atau belum dimulai',
            ], 200);
        }

        // Step 2: cegah user update jika sudah submit semua posisi aktif
        $submittedCount = ElectionEventLog::where('event_id', $validated['event_id'])
            ->where('voted_by', $validated['voted_by'])
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
                    'event_id' => $validated['event_id'],
                    'user_id' => $pos['user_id'],
                    'position_id' => $pos['position_id'],
                ],
                [
                    'voted_by' => $validated['voted_by'],
                    'voted_at' => Carbon::now(),
                ]
            );

            $logs[] = $log;
        }

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil disimpan',
            'data' => $logs,
        ]);
    }

    public function checkParticipation(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|integer|exists:election_events,id',
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $event = ElectionEvent::findOrFail($validated['event_id']);
        $now = Carbon::now();

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
            ->where('voted_by', $validated['user_id'])
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

    public function penjaringan($eventId, $value_type = null)
    {
        $excludedIds = []; // bisa juga []

        $query = DB::table('election_event_logs as e')
            ->selectRaw('
            e.event_id,
            COUNT(DISTINCT e.voted_by) AS jumlah_user_ikut,
            t.total_user,
            ROUND(COUNT(DISTINCT e.voted_by) / t.total_user * 100, 2) AS persentase
        ')
            ->where('e.event_id', $eventId);

        if (! empty($excludedIds)) {
            $query->crossJoin(DB::raw('(SELECT COUNT(*) AS total_user FROM anggota_koperasi u WHERE u.id NOT IN ('.implode(',', $excludedIds).')) t'))
                ->whereNotIn('e.user_id', $excludedIds);
        } else {
            $query->crossJoin(DB::raw('(SELECT COUNT(*) AS total_user FROM anggota_koperasi u) t'));
        }

        $data = $query
            ->groupBy('e.event_id', 't.total_user')
            ->get()
            ->map(function ($row) {
                $row->persentase = (float) $row->persentase;
                $row->sisa = round(100 - $row->persentase, 2);

                return $row;
            });

        // Jika tidak ada data di election_event_logs
        if ($data->isEmpty()) {
            $totalUserQuery = DB::table('anggota_koperasi');
            if (! empty($excludedIds)) {
                $totalUserQuery->whereNotIn('id', $excludedIds);
            }
            $totalUser = $totalUserQuery->count();

            $data = collect([(object) [
                'event_id' => $eventId,
                'jumlah_user_ikut' => 0,
                'total_user' => $totalUser,
                'persentase' => 0.0,
                'sisa' => 100.0,
            ]]);
        }

        // Sesuaikan output berdasarkan value_type
        $result = $data->map(function ($row) use ($value_type) {
            if ($value_type === 'number') {
                return [
                    'event_id' => $row->event_id,
                    'jumlah_user_ikut' => $row->jumlah_user_ikut,
                    'sisa' => $row->total_user - $row->jumlah_user_ikut,
                ];
            } else {
                return [
                    'event_id' => $row->event_id,
                    'persentase' => $row->persentase,
                    'sisa' => $row->sisa,
                ];
            }
        });

        return response()->json($result);
    }

    public function store_tahap2(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'event_id' => 'required|integer',
            'user_id' => 'required|integer',
            'selections' => 'required|array',
            'selections.*.posId' => 'required|integer',
            'selections.*.kandidatId' => 'required|integer',
        ]);

        $now = Carbon::now();

        // Step 1: cek status event & tanggal
        $event = ElectionEvent::findOrFail($validated['event_id']);

        if ($event->status !== 'running') {
            return response()->json([
                'success' => false,
                'message' => 'Event tidak sedang berjalan',
            ], 200);
        }

        $now = Carbon::now();
        if (! ($now->between($event->started_at, $event->finished_at))) {
            return response()->json([
                'success' => false,
                'message' => 'Event sudah berakhir atau belum dimulai',
            ], 200);
        }

        $submittedCount = ElectionEventLog::where('event_id', $validated['event_id'])
            ->where('user_id', $validated['user_id'])
            ->count();

        $totalPositions = Position::where('status', 1)->count();

        if ($submittedCount >= $totalPositions) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memilih semua posisi',
            ], 200);
        }

        // Simpan setiap pilihan ke tabel
        $logs = [];
        foreach ($validated['selections'] as $selection) {
            $log = ElectionEventLog::create([
                'event_id' => $validated['event_id'],
                'user_id' => $validated['user_id'],
                'position_id' => $selection['posId'],
                'voted_by' => $selection['kandidatId'],
                'voted_at' => $now,
            ]);

            $logs[] = $log;
        }

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil disimpan',
            'data' => $logs,
        ], 201);
    }

    public function addRejection(Request $request)
    {
        $request->validate([
            'event_id' => 'required|integer',
            'user_id' => 'required|integer',
            'position_id' => 'required|integer',
            'reason' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // 1. Simpan data ke tabel rejection
            $rejectionId = DB::table('rejection')->insertGetId([
                'description' => $request->reason,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 2. Update ElectionEventLog dengan id rejection
            $logs = ElectionEventLog::where('event_id', $request->event_id)
                ->where('user_id', $request->user_id)
                ->where('position_id', $request->position_id)
                ->get();

            foreach ($logs as $log) {
                $log->rejectionId = $rejectionId; // gunakan snake_case sesuai kolom DB
                $log->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'rejection_id' => $rejectionId,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function removeRejection(Request $request)
    {
        $request->validate([
            'event_id' => 'required|integer',
            'user_id' => 'required|integer',
            'position_id' => 'required|integer',
        ]);

        try {
            DB::beginTransaction();

            // Ambil semua log yang sesuai
            $logs = ElectionEventLog::where('event_id', $request->event_id)
                ->where('user_id', $request->user_id)
                ->where('position_id', $request->position_id)
                ->get();

            if ($logs->isEmpty()) {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada log ditemukan untuk kombinasi ini.',
                ], 404);
            }

            // Ambil rejection_id dari salah satu log (semua seharusnya sama)
            $rejectionId = $logs->first()->rejectionId;

            // Hapus relasi di semua log
            foreach ($logs as $log) {
                $log->rejectionId = null;
                $log->save();
            }

            // Hapus record dari tabel rejection
            if ($rejectionId) {
                DB::table('rejection')->where('id', $rejectionId)->delete();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Rejection berhasil dihapus.',
                'rejection_id' => $rejectionId,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
