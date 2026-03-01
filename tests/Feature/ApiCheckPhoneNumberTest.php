<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

it('returns validation result when phone number is valid', function () {
    DB::table('settings')->insert([
        'key' => 'fonnte_token',
        'value' => 'test_token_123',
    ]);

    Http::fake([
        'api.fonnte.com/validate' => Http::response([
            'status' => true,
            'registered' => true,
            'name' => 'Test User',
        ], 200),
    ]);

    $response = $this->postJson('/api/check-phone-number/628123456789');

    $response->assertSuccessful()
        ->assertJson([
            'status' => true,
            'registered' => true,
        ]);
});

it('returns error when fonnte token is not configured', function () {
    $response = $this->postJson('/api/check-phone-number/628123456789');

    $response->assertStatus(422)
        ->assertJson([
            'error' => 'Fonnte token is not configured in settings.',
        ]);
});

it('calls fonnte api with correct parameters', function () {
    DB::table('settings')->insert([
        'key' => 'fonnte_token',
        'value' => 'test_token_123',
    ]);

    Http::fake([
        'api.fonnte.com/validate' => Http::response([
            'status' => true,
            'registered' => false,
        ], 200),
    ]);

    $this->postJson('/api/check-phone-number/628123456789');

    Http::assertSent(function ($request) {
        return $request->hasHeader('Authorization', 'test_token_123') &&
               $request['target'] === '628123456789' &&
               $request['countryCode'] === '62';
    });
});

it('returns unregistered status when phone is not on whatsapp', function () {
    DB::table('settings')->insert([
        'key' => 'fonnte_token',
        'value' => 'test_token_123',
    ]);

    Http::fake([
        'api.fonnte.com/validate' => Http::response([
            'status' => true,
            'registered' => false,
        ], 200),
    ]);

    $response = $this->postJson('/api/check-phone-number/628999999999');

    $response->assertSuccessful()
        ->assertJson([
            'registered' => false,
        ]);
});
