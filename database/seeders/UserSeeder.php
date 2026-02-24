<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch roles (must exist from RoleSeeder)
        $adminRole    = Role::where('name', 'Admin')->first();
        $candidateRole = Role::where('name', 'Candidate')->first();
        $voterRole     = Role::where('name', 'Voter')->first();

        // Create Admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'), // change this in production!
            ]
        );
        $admin->assignRole($adminRole);

        // Create Candidate user
        // $candidate = User::firstOrCreate(
        //     ['email' => 'candidate@example.com'],
        //     [
        //         'name' => 'Default Candidate',
        //         'password' => bcrypt('password'), // change this in production!
        //     ]
        // );
        // $candidate->assignRole($candidateRole);

        // Create Voter user
        // $voter = User::firstOrCreate(
        //     ['email' => 'voter@example.com'],
        //     [
        //         'name' => 'Default Voter',
        //         'password' => bcrypt('password'), // change this in production!
        //     ]
        // );
        // $voter->assignRole($voterRole);
    }
}
