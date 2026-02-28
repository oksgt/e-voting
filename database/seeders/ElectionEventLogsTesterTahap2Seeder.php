<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ElectionEventLogsTesterTahap2Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $eventId = 4; // id event
        $userIds = range(37, 88); // total 51 user

        // Kandidat per posisi (hasil ekstraksi dari JSON)
        $positionCandidates = [
            1 => [62, 64], // Ketua
            2 => [77, 46], // Sekretaris
            6 => [75, 60], // Bendahara
            3 => [87, 88], // Dewan Pengawas
            4 => [52, 75], // Anggota Dewan Pengawas 1
            5 => [60, 87], // Anggota Dewan Pengawas 2
        ];

        foreach ($userIds as $voterId) {
            foreach ($positionCandidates as $posId => $candidates) {
                // Pilih salah satu kandidat secara acak dari 2 kandidat yang tersedia
                $chosenCandidate = collect($candidates)->random();

                DB::table('election_event_logs')->insert([
                    'event_id'   => $eventId,
                    'user_id'    => $chosenCandidate, // kandidat yang dipilih
                    'position_id'=> $posId,
                    'voted_by'   => $voterId,         // siapa yang memilih
                    'voted_at'   => Carbon::now(),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }
    }

}
