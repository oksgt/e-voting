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
        Schema::create('election_events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->dateTime('start_date'); // waktu mulai event
            $table->integer('duration'); // durasi dalam menit
            $table->boolean('is_autorun')->default(false);
            $table->enum('status', ['pending', 'scheduled', 'running', 'finished', 'cancelled'])
                ->default('pending');
            $table->boolean('is_running')->default(false); // opsional, bisa dipakai untuk query cepat
            $table->dateTime('started_at')->nullable();
            $table->dateTime('finished_at')->nullable();
            $table->timestamps(); // created_at & updated_at
            $table->softDeletes(); // deleted_at
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('election_event');
    }
};
