<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventsRequest;
use App\Models\ElectionEvent;
use App\Models\Position;
use App\Models\User;
use Illuminate\Http\Request;
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
            ->orderBy('created_at', 'desc')
            ->get();

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
        $runningEvent = ElectionEvent::where('is_running', 1)->first();

        if (!$runningEvent) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada event yang sedang berlangsung',
                'data'    => null
            ], 404);
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

    public function getVoterList(Request $request){

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
            'finished_at'  => $request->finished_at,
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
    public function show(ElectionEvent $electionEvent)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ElectionEvent $event)
    {
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
            'started_at'  => $request->start_date,
            'finishe_at'  => $request->start_date,
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
