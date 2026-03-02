<?php

use App\Models\Bidang;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

function createAdminUser(): User
{
    Role::findOrCreate('Admin', 'web');
    $user = User::factory()->create();
    $user->assignRole('Admin');

    return $user;
}

it('displays the bidang index page for admin', function () {
    $admin = createAdminUser();
    Bidang::factory()->count(3)->create();

    $this->actingAs($admin)
        ->get(route('bidang.index'))
        ->assertSuccessful();
});

it('forbids non-admin from accessing bidang index', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('bidang.index'))
        ->assertForbidden();
});

it('displays the create bidang page', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('bidang.create'))
        ->assertSuccessful();
});

it('stores a new bidang', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->post(route('bidang.store'), [
            'nama_bidang' => 'Bidang Keuangan',
        ])
        ->assertRedirect(route('bidang.index'));

    $this->assertDatabaseHas('bidang', [
        'nama_bidang' => 'Bidang Keuangan',
    ]);
});

it('validates nama_bidang is required on store', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->post(route('bidang.store'), [
            'nama_bidang' => '',
        ])
        ->assertSessionHasErrors('nama_bidang');
});

it('validates nama_bidang uniqueness on store', function () {
    $admin = createAdminUser();
    Bidang::factory()->create(['nama_bidang' => 'Bidang Keuangan']);

    $this->actingAs($admin)
        ->post(route('bidang.store'), [
            'nama_bidang' => 'Bidang Keuangan',
        ])
        ->assertSessionHasErrors('nama_bidang');
});

it('displays the edit bidang page', function () {
    $admin = createAdminUser();
    $bidang = Bidang::factory()->create();

    $this->actingAs($admin)
        ->get(route('bidang.edit', $bidang))
        ->assertSuccessful();
});

it('updates an existing bidang', function () {
    $admin = createAdminUser();
    $bidang = Bidang::factory()->create(['nama_bidang' => 'Old Name']);

    $this->actingAs($admin)
        ->put(route('bidang.update', $bidang), [
            'nama_bidang' => 'New Name',
        ])
        ->assertRedirect(route('bidang.index'));

    $this->assertDatabaseHas('bidang', [
        'id' => $bidang->id,
        'nama_bidang' => 'New Name',
    ]);
});

it('allows updating bidang with same name', function () {
    $admin = createAdminUser();
    $bidang = Bidang::factory()->create(['nama_bidang' => 'Same Name']);

    $this->actingAs($admin)
        ->put(route('bidang.update', $bidang), [
            'nama_bidang' => 'Same Name',
        ])
        ->assertRedirect(route('bidang.index'));
});

it('deletes a bidang', function () {
    $admin = createAdminUser();
    $bidang = Bidang::factory()->create();

    $this->actingAs($admin)
        ->delete(route('bidang.destroy', $bidang))
        ->assertRedirect(route('bidang.index'));

    $this->assertDatabaseMissing('bidang', [
        'id' => $bidang->id,
    ]);
});

it('searches bidang by nama_bidang', function () {
    $admin = createAdminUser();
    Bidang::factory()->create(['nama_bidang' => 'Keuangan']);
    Bidang::factory()->create(['nama_bidang' => 'Pemasaran']);

    $this->actingAs($admin)
        ->get(route('bidang.index', ['search' => 'Keuangan']))
        ->assertSuccessful();
});
