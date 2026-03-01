<?php

use App\Models\AnggotaKoperasi;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns all anggota when no bidang filter', function () {
    AnggotaKoperasi::factory()->count(5)->create();

    $response = $this->getJson('/api/anggota');

    $response->assertSuccessful()
        ->assertJsonCount(5, 'data');
});

it('filters anggota by bidang', function () {
    AnggotaKoperasi::factory()->count(3)->create(['bidang' => 'KEUANGAN']);
    AnggotaKoperasi::factory()->count(2)->create(['bidang' => 'DIREKSI']);

    $response = $this->getJson('/api/anggota?bidang=KEUANGAN');

    $response->assertSuccessful()
        ->assertJsonCount(3, 'data');
});

it('returns empty when bidang not found', function () {
    AnggotaKoperasi::factory()->count(2)->create(['bidang' => 'KEUANGAN']);

    $response = $this->getJson('/api/anggota?bidang=NONEXISTENT');

    $response->assertSuccessful()
        ->assertJsonCount(0, 'data');
});

it('encrypts nik in api response', function () {
    $anggota = AnggotaKoperasi::factory()->create(['nik' => '1234567890123456']);

    $response = $this->getJson('/api/anggota');

    $response->assertSuccessful();

    $data = $response->json('data.0');
    expect($data['nik'])->not->toBe('1234567890123456');
    expect($data['nik'])->toBeString();

    // Verify it can be decrypted back
    $key = config('app.nik_encryption_key');
    $decoded = base64_decode($data['nik']);
    $iv = substr($decoded, 0, 16);
    $ciphertext = substr($decoded, 16);
    $decrypted = openssl_decrypt($ciphertext, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);

    expect($decrypted)->toBe('1234567890123456');
});
