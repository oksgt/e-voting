<?php

use App\Models\AnggotaKoperasi;
use App\Models\Bidang;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

function createAdmin(): User
{
    Role::findOrCreate('Admin', 'web');
    $user = User::factory()->create();
    $user->assignRole('Admin');

    return $user;
}

function validAnggotaData(array $overrides = []): array
{
    $bidang = Bidang::factory()->create();

    return array_merge([
        'nama' => 'John Doe',
        'nik' => '1234567890123456',
        'bidang' => $bidang->nama_bidang,
        'nowa' => '081234567890',
    ], $overrides);
}

it('displays the anggota koperasi index page for admin', function () {
    $admin = createAdmin();
    Bidang::factory()->create();
    AnggotaKoperasi::factory()->count(3)->create();

    $this->actingAs($admin)
        ->get(route('anggota-koperasi.index'))
        ->assertSuccessful();
});

it('forbids non-admin from accessing anggota koperasi index', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('anggota-koperasi.index'))
        ->assertForbidden();
});

it('displays the create anggota koperasi page', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->get(route('anggota-koperasi.create'))
        ->assertSuccessful();
});

it('stores a new anggota koperasi', function () {
    $admin = createAdmin();
    $data = validAnggotaData();

    $this->actingAs($admin)
        ->post(route('anggota-koperasi.store'), $data)
        ->assertRedirect(route('anggota-koperasi.index'));

    $this->assertDatabaseHas('anggota_koperasi', [
        'nama' => 'John Doe',
        'nik' => '1234567890123456',
    ]);
});

it('validates nama is required on store', function () {
    $admin = createAdmin();
    $data = validAnggotaData(['nama' => '']);

    $this->actingAs($admin)
        ->post(route('anggota-koperasi.store'), $data)
        ->assertSessionHasErrors('nama');
});

it('validates nik is required on store', function () {
    $admin = createAdmin();
    $data = validAnggotaData(['nik' => '']);

    $this->actingAs($admin)
        ->post(route('anggota-koperasi.store'), $data)
        ->assertSessionHasErrors('nik');
});

it('validates nik uniqueness on store', function () {
    $admin = createAdmin();
    $data = validAnggotaData();
    AnggotaKoperasi::factory()->create(['nik' => $data['nik']]);

    $this->actingAs($admin)
        ->post(route('anggota-koperasi.store'), $data)
        ->assertSessionHasErrors('nik');
});

it('validates bidang exists on store', function () {
    $admin = createAdmin();
    $data = validAnggotaData(['bidang' => 'Non Existent Bidang']);

    $this->actingAs($admin)
        ->post(route('anggota-koperasi.store'), $data)
        ->assertSessionHasErrors('bidang');
});

it('validates nowa is required on store', function () {
    $admin = createAdmin();
    $data = validAnggotaData(['nowa' => '']);

    $this->actingAs($admin)
        ->post(route('anggota-koperasi.store'), $data)
        ->assertSessionHasErrors('nowa');
});

it('displays the edit anggota koperasi page', function () {
    $admin = createAdmin();
    $anggota = AnggotaKoperasi::factory()->create();

    $this->actingAs($admin)
        ->get(route('anggota-koperasi.edit', $anggota))
        ->assertSuccessful();
});

it('updates an existing anggota koperasi', function () {
    $admin = createAdmin();
    $anggota = AnggotaKoperasi::factory()->create();
    $bidang = Bidang::factory()->create();

    $this->actingAs($admin)
        ->put(route('anggota-koperasi.update', $anggota), [
            'nama' => 'Updated Name',
            'nik' => '9999999999999999',
            'bidang' => $bidang->nama_bidang,
            'nowa' => '089999999999',
        ])
        ->assertRedirect(route('anggota-koperasi.index'));

    $this->assertDatabaseHas('anggota_koperasi', [
        'id' => $anggota->id,
        'nama' => 'Updated Name',
        'nik' => '9999999999999999',
    ]);
});

it('allows updating anggota koperasi with same nik', function () {
    $admin = createAdmin();
    $bidang = Bidang::factory()->create();
    $anggota = AnggotaKoperasi::factory()->create(['bidang' => $bidang->nama_bidang]);

    $this->actingAs($admin)
        ->put(route('anggota-koperasi.update', $anggota), [
            'nama' => $anggota->nama,
            'nik' => $anggota->nik,
            'bidang' => $bidang->nama_bidang,
            'nowa' => $anggota->nowa,
        ])
        ->assertRedirect(route('anggota-koperasi.index'));
});

it('deletes an anggota koperasi', function () {
    $admin = createAdmin();
    $anggota = AnggotaKoperasi::factory()->create();

    $this->actingAs($admin)
        ->delete(route('anggota-koperasi.destroy', $anggota))
        ->assertRedirect(route('anggota-koperasi.index'));

    $this->assertDatabaseMissing('anggota_koperasi', [
        'id' => $anggota->id,
    ]);
});

it('searches anggota koperasi by nama', function () {
    $admin = createAdmin();
    AnggotaKoperasi::factory()->create(['nama' => 'Budi Santoso']);
    AnggotaKoperasi::factory()->create(['nama' => 'Andi Wijaya']);

    $this->actingAs($admin)
        ->get(route('anggota-koperasi.index', ['search' => 'Budi']))
        ->assertSuccessful();
});

it('forbids non-admin from accessing create page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('anggota-koperasi.create'))
        ->assertForbidden();
});

it('forbids non-admin from accessing edit page', function () {
    $user = User::factory()->create();
    $anggota = AnggotaKoperasi::factory()->create();

    $this->actingAs($user)
        ->get(route('anggota-koperasi.edit', $anggota))
        ->assertForbidden();
});
