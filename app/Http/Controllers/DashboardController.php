<?php

namespace App\Http\Controllers;

use App\Models\ElectionEvent;
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
        $runningEvent = ElectionEvent::where('status', 'running')->first();
        $voters = User::with('roles')
            ->whereHas('roles', function ($q) {
                $q->where('name', 'Voter');
            })->get();

        $view = 'dashboard';
        if ($user_role === 'Voter') {
            $view = 'dashboard-voter';
        }

        return Inertia::render($view, [
            'user' => $user,
            'roles' => $user->roles->pluck('name'),
            'runningEvent' => $runningEvent,
            'voters' => [
                'approved' => $voters
                    ->where('whatsapp_active', 1)
                    ->where('status', 'approved')
                    ->count(),
                'pending'=> $voters
                    ->where('whatsapp_active', 0)
                    ->where('status', 'pending')
                    ->count(),
                'rejected'=> $voters
                    ->where('status', 'rejected')
                    ->count(),
                'registered' => $voters->count()
            ],
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
