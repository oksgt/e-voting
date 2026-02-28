<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ElectionEventLogsTesterSeeder extends Seeder
{
    public function run()
    {
        $eventId = 3; // id event
        $userIds = range(37, 57); // total 51 user
        $positionIds = range(1, 6); // 6 posisi

        foreach ($userIds as $voterId) {
            // ambil kandidat acak untuk 6 posisi, pastikan berbeda
            $candidates = collect($userIds)
                ->shuffle()
                ->take(count($positionIds))
                ->values();

            foreach ($positionIds as $index => $posId) {
                DB::table('election_event_logs')->insert([
                    'event_id'   => $eventId,
                    'user_id'    => $candidates[$index],
                    'position_id'=> $posId,
                    'voted_by'   => $voterId,
                    'voted_at'   => Carbon::now(),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }
    }

}
