<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VotingRolePlaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('voting_role_play')->insert([
            [
                'role_play' => 'Prosedur Nominasi Kandidat (Candidate Nomination Procedure)',
                'description' => 'Aturan nominasi:
- Satu anggota → satu nominasi per posisi.
Setiap anggota berhak mengusulkan siapa yang cocok untuk setiap jabatan (Ketua, Sekretaris, Bendahara, Dewas, Anggota Dewas 1, Anggota Dewas 2).
- Tidak boleh mencalonkan orang yang sama untuk dua posisi berbeda dalam satu nominasi.
Misalnya, jika Anggota A sudah mencalonkan B sebagai Ketua, maka A tidak bisa mencalonkan B lagi sebagai Sekretaris.
- Self-nomination terbatas.
Setiap anggota hanya boleh mencalonkan dirinya sendiri untuk satu posisi saja, agar tidak ada yang menguasai semua jabatan sekaligus.
- Kandidat bisa muncul di banyak posisi, tetapi dari nominasi anggota berbeda.
Contoh: B bisa dicalonkan sebagai Ketua oleh A, dan sebagai Sekretaris oleh C.
',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

    }
}
