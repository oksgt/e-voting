<?php

namespace App\Http\Controllers;

use App\Http\Requests\BidangRequest;
use App\Http\Resources\BidangCollection;
use App\Models\Bidang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BidangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (! auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }

        $search = $request->input('search');
        $per_page = $request->integer('per_page', 10);
        $sort_by = $request->input('sort_by');
        $sort_direction = $request->input('sort_direction');

        $bidang = Bidang::query()
            ->when($search, function ($query, $search) {
                $query->where('nama_bidang', 'like', "%{$search}%");
            })
            ->when(
                $sort_by && in_array($sort_by, ['nama_bidang', 'created_at'], true),
                fn ($q) => $q->orderBy($sort_by, $sort_direction === 'desc' ? 'desc' : 'asc'),
                fn ($q) => $q->orderBy('created_at', 'desc')
            )
            ->paginate($per_page);

        return Inertia::render('Bidang/Index', [
            'bidang' => new BidangCollection($bidang),
            'filters' => [
                'per_page' => $per_page,
                'search' => $search,
                'sort_by' => $sort_by,
                'sort_direction' => $sort_direction,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (! auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Bidang/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BidangRequest $request)
    {
        Bidang::create($request->validated());

        return redirect()
            ->route('bidang.index')
            ->with('success', 'Bidang berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bidang $bidang)
    {
        if (! auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Bidang/Edit', [
            'bidang' => $bidang,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BidangRequest $request, Bidang $bidang)
    {
        $bidang->update($request->validated());

        return redirect()
            ->route('bidang.index')
            ->with('success', 'Bidang berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bidang $bidang)
    {
        $bidang->delete();

        return redirect()
            ->route('bidang.index')
            ->with('success', 'Bidang berhasil dihapus.');
    }
}
