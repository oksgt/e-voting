<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ElectionEventLogsTesterSeeder extends Seeder
{
    public function run()
    {
        $eventId = 3; // id event
        $positionIds = range(1, 6); // 6 posisi

        // Ambil semua user id kecuali id = 1
        $userIds = DB::table('users')
            ->where('id', '!=', 1)
            ->pluck('id');

        foreach ($userIds as $voterId) {

            foreach ($positionIds as $posId) {

                $candidateId = $userIds
                    ->where('id', '!=', $voterId) // tidak pilih diri sendiri
                    ->random(); // random tunggal per posisi

                DB::table('election_event_logs')->insert([
                    'event_id' => $eventId,
                    'user_id' => $candidateId,
                    'position_id' => $posId,
                    'voted_by' => $voterId,
                    'voted_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
