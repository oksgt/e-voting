<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PermissionSeeder::class, // creates permissions
            RoleSeeder::class,       // creates roles and attaches permissions
            UserSeeder::class,       // creates initial users and assigns roles
            BidangSeed::class,
            AnggotaKoperasiSeed::class,
        ]);

    }
}
