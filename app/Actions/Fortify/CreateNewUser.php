<?php

namespace App\Actions\Fortify;

use App\Models\AnggotaKoperasi;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Spatie\Permission\Models\Role;

class CreateNewUser implements CreatesNewUsers
{
    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $generatedEmail = sprintf('%s@example.com', $input['nik'] ?? '');
        $payload = array_merge($input, ['email_generated' => $generatedEmail]);

        Validator::make($payload, [
            'name' => ['required', 'string', 'max:255'],
            'nik' => [
                'required',
                'string',
                'size:16',
                'regex:/^\d{16}$/',
                Rule::unique('users', 'nik')->whereNull('deleted_at'),
            ],
            'bidang' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            // validasi email generated agar tetap aman terhadap data lama
            'email_generated' => [
                Rule::unique(User::class, 'email')->whereNull('deleted_at'),
            ],
        ], [], [
            'email_generated' => 'email',
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'nik' => $input['nik'],
            'bidang' => $input['bidang'],
            'phone_number' => $input['phone_number'],
            'email' => $generatedEmail,
            'password' => $input['password'],
            'status' => 'approved',
            'login_method' => 'password',
            'whatsapp_active' => false,
        ]);

        $voterRole = Role::findOrCreate('Voter', 'web');
        $user->assignRole($voterRole);

        // Update anggota koperasi dengan user_id dan registered_at
        AnggotaKoperasi::where('nik', $input['nik'])
            ->update([
                'user_id' => $user->id,
                'nowa' => $input['phone_number'],
                'nik' => $input['nik'],
                'registered_at' => now(),
            ]);

        return $user;
    }
}
