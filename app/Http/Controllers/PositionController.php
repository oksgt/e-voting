<?php

namespace App\Http\Controllers;

use App\Http\Requests\PositionRequest;
use App\Http\Resources\PositionCollection;
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
        if (!auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }

        $search         = $request->input('search');
        $per_page       = $request->integer('per_page', 10);
        $sort_by        = $request->input('sort_by');
        $sort_direction = $request->input('sort_direction');

        $positions = Position::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(
                $sort_by && in_array($sort_by, ['name', 'description', 'status', 'created_at'], true),
                fn($q) => $q->orderBy($sort_by, $sort_direction === 'desc' ? 'desc' : 'asc'),
                fn($q) => $q->orderBy('created_at', 'desc')
            )
            ->paginate($per_page);

        return Inertia::render('Positions/Index', [
            'positions'  => new PositionCollection($positions),
            'filters'    => [
                'per_page'       => $per_page,
                'search' => $search,
                'sort_by'        => $sort_by,
                'sort_direction' => $sort_direction,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }
        return Inertia::render('Positions/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PositionRequest $request)
    {
        $validated = $request->validated();

        Position::create([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'status'      => ($validated['status'] === 'active') ? 1 : 0,
        ]);

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
        if (!auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }
        return Inertia::render('Positions/Edit', [
            'position' => $position,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PositionRequest $request, Position $position)
    {
        $validated = $request->validated();

        $position->update([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'status'      => ($validated['status'] === 'active') ? 1 : 0,
        ]);

        return redirect()
            ->route('positions.index')
            ->with('success', 'Position updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Position $position)
    {
        $position->delete();

        return redirect()
            ->route('positions.index')
            ->with('success', 'Position deleted successfully.');
    }
}
