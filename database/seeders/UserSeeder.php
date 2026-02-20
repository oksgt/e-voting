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
        $adminRole = Role::where('name', 'Admin')->first();
        $userRole  = Role::where('name', 'User')->first();

        // Create Admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'), // change this in production!
            ]
        );
        $admin->assignRole($adminRole);

        // Create normal User
        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Default User',
                'password' => bcrypt('password'), // change this in production!
            ]
        );
        $user->assignRole($userRole);
    }
}
