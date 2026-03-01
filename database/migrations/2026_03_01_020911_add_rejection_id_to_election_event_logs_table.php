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
        Schema::table('election_event_logs', function (Blueprint $table) {
            $table->unsignedBigInteger('rejectionId')->after('deleted_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('election_event_logs', function (Blueprint $table) {
            $table->dropColumn('rejectionId');
        });
    }
};
