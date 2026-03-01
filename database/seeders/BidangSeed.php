<?php

namespace Database\Seeders;

use App\Models\Bidang;
use Illuminate\Database\Seeder;

class BidangSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bidang = [
            'DIREKSI',
            'SATUAN PENGAWAS INTERN',
            'BAG. PERENCANAAN & PENGEMBANGAN',
            'BAG. PRODUKSI & DISTRIBUSI 1',
            'BAG. PRODUKSI & DISTRIBUSI 2',
            'CABANG AJIBARANG',
            'BAG. PENGENDALIAN TEKNIK',
            'BAG. KESEKRETARIATAN',
            'BAG. KEUANGAN',
            'BAG. SUMBER DAYA MANUSIA & TI',
            'BAG. PERLENGKAPAN',
            'CABANG PURWOKERTO 1',
            'CABANG PURWOKERTO 2',
            'CABANG WANGON',
            'CABANG BANYUMAS',
            'KARYAWAN KOPERASI',
            'PENSIUNAN',
        ];

        Bidang::query()->upsert(
            collect($bidang)
                ->map(fn (string $namaBidang) => [
                    'nama_bidang' => $namaBidang,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
                ->all(),
            ['nama_bidang'],
            ['updated_at']
        );
    }
}
