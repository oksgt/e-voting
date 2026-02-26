<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('election_events', function (Blueprint $table) {
            $table->tinyInteger('publis_result')
                ->default(0)
                ->comment('0 = belum publish, 1 = sudah publish')
                ->after('end_date'); // sesuaikan posisi kolom
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('election_events', function (Blueprint $table) {
            $table->dropColumn('publis_result');
        });
    }
};
