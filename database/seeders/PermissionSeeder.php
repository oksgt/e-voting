<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // User & Role Management (Admin)
            "users.view",
            "users.create",
            "users.update",
            "users.delete",
            "roles.view",
            "roles.create",
            "roles.update",
            "roles.delete",

            // Election Management (Admin)
            "elections.view",
            "elections.create",
            "elections.update",
            "elections.delete",
            "elections.publish",
            "elections.close",

            // Candidate Permissions
            "candidates.view",
            "candidates.register",
            "candidates.update",
            "candidates.delete", // only admin should have this

            // Voter Permissions
            "voters.view",
            "voters.register",
            "voters.update",
            "voters.delete", // only admin should have this

            // Voting Actions
            "votes.cast",
            "votes.view_results",

            // Position Permissions
            "positions.view",
            "positions.create",
            "positions.update",
            "positions.delete",
        ];


        foreach ($permissions as $key => $value) {
            Permission::create(['name' => $value]);
        }
    }
}
