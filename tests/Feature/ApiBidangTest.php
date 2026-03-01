<?php

use App\Models\Bidang;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns all bidang', function () {
    Bidang::factory()->count(3)->create();

    $response = $this->getJson('/api/bidang');

    $response->assertSuccessful()
        ->assertJsonCount(3, 'data');
});

it('returns empty array when no bidang exists', function () {
    $response = $this->getJson('/api/bidang');

    $response->assertSuccessful()
        ->assertJsonCount(0, 'data');
});
