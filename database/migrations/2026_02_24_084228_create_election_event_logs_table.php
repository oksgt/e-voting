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
        Schema::create('election_event_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('voted_by')->nullable(); // bisa relasi ke users juga
            $table->dateTime('voted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['id', 'voted_by']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('election_event_logs');
    }
};
