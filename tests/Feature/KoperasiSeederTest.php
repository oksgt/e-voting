<?php

use App\Models\AnggotaKoperasi;
use App\Models\Bidang;
use Database\Seeders\AnggotaKoperasiSeed;
use Database\Seeders\BidangSeed;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('seeds bidang records from BidangSeed', function () {
    $this->seed(BidangSeed::class);

    expect(Bidang::query()->count())->toBe(17)
        ->and(Bidang::query()->where('nama_bidang', 'DIREKSI')->exists())->toBeTrue();
});

it('seeds anggota koperasi records with valid bidang values', function () {
    $this->seed([BidangSeed::class, AnggotaKoperasiSeed::class]);

    expect(AnggotaKoperasi::query()->count())->toBeGreaterThan(200)
        ->and(
            AnggotaKoperasi::query()
                ->where('nama', 'WIPI SUPRIYANTO, S.T., M.I.Kom.')
                ->where('bidang', 'DIREKSI')
                ->exists()
        )->toBeTrue();
});
