<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnggotaKoperasiRequest;
use App\Http\Resources\AnggotaKoperasiCollection;
use App\Models\AnggotaKoperasi;
use App\Models\Bidang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnggotaKoperasiController extends Controller
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

        $anggota = AnggotaKoperasi::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nik', 'like', "%{$search}%")
                        ->orWhere('bidang', 'like', "%{$search}%")
                        ->orWhere('nowa', 'like', "%{$search}%");
                });
            })
            ->when(
                $sort_by && in_array($sort_by, ['nama', 'nik', 'bidang', 'nowa', 'created_at'], true),
                fn ($q) => $q->orderBy($sort_by, $sort_direction === 'desc' ? 'desc' : 'asc'),
                fn ($q) => $q->orderBy('created_at', 'desc')
            )
            ->paginate($per_page);

        return Inertia::render('AnggotaKoperasi/Index', [
            'anggota' => new AnggotaKoperasiCollection($anggota),
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

        return Inertia::render('AnggotaKoperasi/Create', [
            'bidangList' => Bidang::pluck('nama_bidang')->toArray(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AnggotaKoperasiRequest $request)
    {
        AnggotaKoperasi::create($request->validated());

        return redirect()
            ->route('anggota-koperasi.index')
            ->with('success', 'Anggota koperasi berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AnggotaKoperasi $anggotaKoperasi)
    {
        if (! auth()->user()->hasRole('Admin')) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('AnggotaKoperasi/Edit', [
            'anggota' => $anggotaKoperasi,
            'bidangList' => Bidang::pluck('nama_bidang')->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AnggotaKoperasiRequest $request, AnggotaKoperasi $anggotaKoperasi)
    {
        $anggotaKoperasi->update($request->validated());

        return redirect()
            ->route('anggota-koperasi.index')
            ->with('success', 'Anggota koperasi berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AnggotaKoperasi $anggotaKoperasi)
    {
        $anggotaKoperasi->delete();

        return redirect()
            ->route('anggota-koperasi.index')
            ->with('success', 'Anggota koperasi berhasil dihapus.');
    }
}
