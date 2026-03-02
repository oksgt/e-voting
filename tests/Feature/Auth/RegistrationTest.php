<?php

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'nik' => '1234567890123456',
        'bidang' => 'Test Bidang',
        'phone_number' => '628123456789',
        'password' => 'Password123',
        'password_confirmation' => 'Password123',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect();
});

test('registration updates anggota koperasi with user_id and registered_at', function () {
    // Arrange: Buat anggota koperasi
    $anggota = \App\Models\AnggotaKoperasi::create([
        'nama' => 'John Doe',
        'nik' => '9876543210123456',
        'bidang' => 'IT',
        'nowa' => '628123456788',
    ]);

    expect($anggota->user_id)->toBeNull();
    expect($anggota->registered_at)->toBeNull();

    // Act: Register user dengan NIK yang sama
    $response = $this->post(route('register.store'), [
        'name' => 'John Doe',
        'nik' => '9876543210123456',
        'bidang' => 'IT',
        'phone_number' => '628123456788',
        'password' => 'Password123',
        'password_confirmation' => 'Password123',
    ]);

    // Assert: User berhasil dibuat dan authenticated
    $this->assertAuthenticated();
    $response->assertRedirect();

    // Assert: Anggota koperasi ter-update dengan user_id dan registered_at
    $anggota->refresh();
    expect($anggota->user_id)->not->toBeNull();
    expect($anggota->registered_at)->not->toBeNull();
    expect($anggota->user_id)->toBe(\App\Models\User::where('nik', '9876543210123456')->first()->id);
});
