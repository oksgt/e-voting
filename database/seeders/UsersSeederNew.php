<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class UsersSeederNew extends Seeder
{
    public function run(): void
    {
        $anggota = DB::table('anggota_koperasi')->get();

        $role = Role::firstOrCreate(['name' => 'Voter']);

        foreach ($anggota as $item) {

            // Jika NIK ada → pakai updateOrCreate
            if (!empty($item->nik)) {

                $user = User::updateOrCreate(
                    ['nik' => $item->nik],
                    [
                        'name' => $item->nama,
                        'email' => $item->nik . '@example.com',
                        'status' => 'approved',
                        'bidang' => $item->bidang,
                        'phone_number' => $item->nowa ?: null,
                        'login_method' => 'password',
                        'whatsapp_active' => !empty($item->nowa) ? 1 : 0,
                        'password' => Hash::make('password123'),
                        'approved_at' => Carbon::now(),
                    ]
                );

            } else {

                // Jika NIK kosong → selalu create baru
                $user = User::create([
                    'nik' => null,
                    'name' => $item->nama,
                    'email' => uniqid() . '@example.com',
                    'status' => 'approved',
                    'bidang' => $item->bidang,
                    'phone_number' => $item->nowa ?: null,
                    'login_method' => 'password',
                    'whatsapp_active' => !empty($item->nowa) ? 1 : 0,
                    'password' => Hash::make('password123'),
                    'approved_at' => Carbon::now(),
                ]);
            }

            $user->syncRoles([$role->name]);
        }
    }
}
