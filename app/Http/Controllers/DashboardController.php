<?php

namespace App\Http\Controllers;

use App\Http\Resources\DashboardEventResource;
use App\Http\Resources\PositionResource;
use App\Models\ElectionEvent;
use App\Models\Position;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user()->load('roles');

        // ambil role pertama dengan aman
        $user_role = $user->roles->pluck('name')->first();
        $eventModels = ElectionEvent::query()
            ->orderByRaw("CASE WHEN status = 'running' THEN 0 ELSE 1 END")
            ->orderByDesc('started_at')
            ->orderByDesc('created_at')
            ->get();
        $runningEvent = $eventModels->firstWhere('status', 'running');
        $electionEvents = DashboardEventResource::collection($eventModels)->resolve();
        $runningEventResource = $runningEvent ? DashboardEventResource::make($runningEvent)->resolve() : null;
        // Status counts (always across all voters, unaffected by search/status filter)
        $rawCounts = User::query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');
        $statusCounts = [
            'total' => $rawCounts->sum(),
            'pending' => $rawCounts->get('pending', 0),
            'approved' => $rawCounts->get('approved', 0),
            'rejected' => $rawCounts->get('rejected', 0),
        ];

        $positionCounts = [
            'total' => Position::query()->count(),
            'active' => Position::query()->where('status', 1)->count(),
            'inactive' => Position::query()->where('status', 0)->count(),
        ];
        $activePositions = PositionResource::collection(
            Position::query()
                ->where('status', 1)
                ->orderBy('name')
                ->get()
        )->resolve();

        $view = 'dashboard';

        if ($user_role === 'Voter') {
            $view = 'dashboard-voter';
        }

        return Inertia::render($view, [
            'user' => $user,
            'roles' => $user->roles->pluck('name'),
            'runningEvent' => $runningEventResource,
            'electionEvents' => $electionEvents,
            'voters' => $statusCounts,
            'positions' => $positionCounts,
            'activePositions' => $activePositions,
            'userStatus' => $user->status,
        ]);

    }

    public function getRunningEvent(Request $request)
    {
        $runningEvent = ElectionEvent::where('is_running', 1)->first();

        if (! $runningEvent) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada event yang sedang berlangsung',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'List Data Products',
            'data' => $runningEvent,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
