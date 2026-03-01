<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventsRequest;
use App\Models\ElectionEvent;
use App\Models\Position;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ElectionEventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $electionEvent = ElectionEvent::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('keyword', 'like', "%{$search}%");
                });
            })
            ->orderBy('id', 'asc')
            ->get();

        if (!auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Events/Index', [
            'events'     => $electionEvent,
            'authUserId' => auth()->id(),
            'filters'    => [
                'search' => $search,
            ],
            'csrfToken' => csrf_token(),
        ]);
    }

    public function getRunningEvent(Request $request)
    {
        $runningEvent = ElectionEvent::where('status', 'running')->first();

        if (!$runningEvent) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada event yang sedang berlangsung',
                'data'    => null
            ], 404);
        }

        $now = Carbon::now();

        // Jika waktu sekarang di luar rentang started_at dan finished_at
        if ($now->lt(Carbon::parse($runningEvent->started_at)) || $now->gt(Carbon::parse($runningEvent->finished_at))) {
            return response()->json([
                'success' => false,
                'message' => 'Event sudah berakhir atau belum dimulai',
                'data'    => null
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'List Data Products',
            'data'    => $runningEvent
        ]);
    }


    public function getActivePosition(Request $request)
    {
        $position = Position::where('status', 1)
            ->orderBy('number', 'asc')
            ->get();

        if (!$position) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada data posisi',
                'data'    => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'List Data Position',
            'data'    => $position
        ]);
    }

    public function topTwoPerPosition($eventId, $limit = null)
    {
        // Ambil semua posisi aktif
        $positions = Position::where('status', 1)
            ->orderBy('number', 'asc')
            ->get();

        $result = [];

        foreach ($positions as $position) {

            $excludedIds = [1]; // bisa juga []

            // Ambil kandidat top 2 berdasarkan jumlah nominasi (user_id)
            $query = DB::table('election_event_logs as e')
                ->join('users as u', 'u.id', '=', 'e.user_id')
                ->select(
                    'u.id',
                    'u.name',
                    DB::raw('COUNT(e.id) as total_votes'),
                    DB::raw('COUNT(e.rejectionId) as filled_rejections'),
                    DB::raw('SUM(CASE WHEN e.rejectionId IS NULL THEN 1 ELSE 0 END) as null_rejections')
                )
                ->where('e.event_id', $eventId)
                ->where('e.position_id', $position->id)
                ->when(!empty($excludedIds), function ($query) use ($excludedIds) {
                    $query->whereNotIn('u.id', $excludedIds);
                })
                ->groupBy('u.id', 'u.name')
                ->orderByDesc('total_votes');

            if (!is_null($limit)) {
                $query->limit($limit);
            }

            $candidates = $query->get();

            // Hitung total semua suara di posisi ini
            $totalVotes = DB::table('election_event_logs')
                ->where('event_id', $eventId)
                ->where('position_id', $position->id)
                ->when(!empty($excludedIds), function ($query) use ($excludedIds) {
                    $query->whereNotIn('user_id', $excludedIds); // <-- perbaikan: filter kandidat
                })
                ->count();

            $position_id = $position->id;

            // Tambahkan persentase
            $candidates = $candidates->map(function ($c) use ($totalVotes, &$position_id, &$eventId) {
                $c->persentase = $totalVotes > 0
                    ? round(($c->total_votes / $totalVotes) * 100, 4)
                    : 0;

                $c->position_id = $position_id;
                $c->event_id = (int) $eventId;
                return $c;
            });

            $result[] = [
                'id' => $position->id,
                'position' => $position->name,
                'total_votes' => $totalVotes,
                'candidates' => $candidates,
            ];
        }

        return response()->json($result);
    }

    public function getVoterList(Request $request)
    {

        $search = $request->input('search');

        $voter = User::with('roles')
            ->whereHas('roles', function ($q) {
                $q->where('name', 'Voter');
            })
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->where('status', 'approved')
            ->orderBy('name', 'asc')
            ->get();

        if (!$voter) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada data',
                'data'    => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'List Data Voter',
            'data'    => $voter
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Events/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EventsRequest $request)
    {
        $eventData = [
            'name'        => $request->name,
            'keyword'     => $request->keyword,
            'description' => $request->description,
            'started_at'  => $request->started_at,
            'finished_at' => $request->finished_at,
            'is_autorun'  => $request->boolean('is_autorun'),
            'status'      => 'scheduled',
            'is_running'  => 0, // default saat create
        ];

        $event = ElectionEvent::create($eventData);

        return redirect()
            ->route('events.index')
            ->with('success', 'Event created successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(ElectionEvent $event)
    {
        if (!auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Events/Summary', [
            'event' => $event
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ElectionEvent $event)
    {
        if (!auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }
        // Kirim data event ke view inertia/react edit form
        return Inertia::render('Events/Edit', [
            'event' => $event
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EventsRequest $request, ElectionEvent $event)
    {
        $eventData = [
            'name'        => $request->name,
            'keyword'     => $request->keyword,
            'description' => $request->description,
            'started_at'  => $request->started_at,
            'finished_at' => $request->finished_at,
            'duration'    => $request->duration,
            'is_autorun'  => $request->boolean('is_autorun'),
            'status'      => $request->status,
            'is_running'  => $request->boolean('is_running') ?? 0,
            'started_at'  => $request->started_at,
            'finished_at' => $request->finished_at,
        ];

        $event->update($eventData);

        return redirect()
            ->route('events.index')
            ->with('success', 'Election Event updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ElectionEvent $event)
    {
        // Soft delete other users
        $event->delete();

        return redirect()
            ->route('events.index')
            ->with('success', 'Event deleted successfully.');
    }

    public function eventControl(ElectionEvent $event)
    {
        // Kirim data event ke view inertia/react edit form
        return Inertia::render('Events/Running', [
            'event' => $event
        ]);
    }
}
