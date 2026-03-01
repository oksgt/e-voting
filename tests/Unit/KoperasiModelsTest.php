<?php

use App\Models\AnggotaKoperasi;
use App\Models\Bidang;

it('uses the correct table for bidang model', function () {
    $model = new Bidang;

    expect($model->getTable())->toBe('bidang');
});

it('allows mass assignment for bidang model', function () {
    $model = new Bidang;

    expect($model->getFillable())->toBe([
        'nama_bidang',
    ]);
});

it('uses the correct table for anggota koperasi model', function () {
    $model = new AnggotaKoperasi;

    expect($model->getTable())->toBe('anggota_koperasi');
});

it('allows mass assignment for anggota koperasi model', function () {
    $model = new AnggotaKoperasi;

    expect($model->getFillable())->toBe([
        'nama',
        'nik',
        'bidang',
        'nowa',
    ]);
});
