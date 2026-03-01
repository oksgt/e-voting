<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $candidateRole = Role::firstOrCreate(['name' => 'Candidate']);
        $voterRole = Role::firstOrCreate(['name' => 'Voter']);

        // Assign all permissions to Admin
        $adminRole->syncPermissions(Permission::all());

        // Candidate permissions
        $candidateRole->syncPermissions([
            'candidates.view',
            'candidates.register',
            'candidates.update',
            'votes.view_results',
        ]);

        // Voter permissions
        $voterRole->syncPermissions([
            'voters.register',
            'voters.update',
            'votes.cast',
            'votes.view_results',
        ]);
    }
}
