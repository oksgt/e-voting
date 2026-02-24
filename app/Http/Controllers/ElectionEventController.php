<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventsRequest;
use App\Models\ElectionEvent;
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
            'start_date'  => $request->start_date,
            'duration'    => $request->duration,
            'is_autorun'  => $request->boolean('is_autorun'),
            'status'      => 'scheduled',
            'is_running'  => 0, // default saat create
            'started_at'  => null,
            'finished_at' => null,
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
            'start_date'  => $request->start_date,
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
