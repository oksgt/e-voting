<?php

namespace App\Http\Controllers;

use App\Http\Requests\PositionRequest;
use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $positions = Position::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Positions/Index', [
            'positions'  => $positions,
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
        return Inertia::render('Positions/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PositionRequest $request)
    {
        $positionData = [
            'name'        => $request->name,
            'description' => $request->description,
            'status'      => ($request->status === 'active') ? 1 : 0,
        ];

        $position = Position::create($positionData);

        return redirect()
            ->route('positions.index')
            ->with('success', 'Position created successfully.');
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
    public function edit(Position $position)
    {
        return Inertia::render('Positions/Edit', [
            'user' => $position
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PositionRequest $request, Position $position)
    {
        $positionData = [
            'name'        => $request->name,
            'description' => $request->description,
            'status'      => ($request->status === 'active') ? 1 : 0,
        ];

        $position->update($positionData);

        return redirect()
            ->route('positions.index')
            ->with('success', 'Position updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Position $position)
    {

        // Soft delete other users
        $position->delete();

        return redirect()
            ->route('positions.index')
            ->with('success', 'User deleted successfully.');
    }
}
