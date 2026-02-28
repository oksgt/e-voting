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
        $userIds = range(37, 57); // total 51 user

        // Kandidat per posisi (hasil ekstraksi dari JSON)
        $positionCandidates = [
            1 => [37, 38], // Ketua
            2 => [48, 55], // Sekretaris
            6 => [49, 39], // Bendahara
            3 => [45, 42], // Dewan Pengawas
            4 => [47, 42], // Anggota Dewan Pengawas 1
            5 => [41, 42], // Anggota Dewan Pengawas 2
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
