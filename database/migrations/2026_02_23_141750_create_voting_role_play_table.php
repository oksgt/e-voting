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
        Schema::create('voting_role_play', function (Blueprint $table) {
            $table->id();
            $table->string('role_play', 150); // nama role play
            $table->text('description');      // deskripsi aturan nominasi
            $table->boolean('status')->default(1); // 1 = aktif, 0 = tidak aktif
            $table->timestamps();
            $table->softDeletes();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voting_role_play');
    }
};
