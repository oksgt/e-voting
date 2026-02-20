<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $userRole  = Role::firstOrCreate(['name' => 'User']);

        // Assign all permissions to Admin
        $adminRole->syncPermissions(Permission::all());

        // Assign limited permissions to User
        $userRole->syncPermissions([
            'users.view',
            'roles.view',
        ]);
    }
}
