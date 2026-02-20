<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Tambah kolom baru
            $table->string('nik', 16)->nullable()->after('id');
            $table->string('phone_number')->nullable()->after('email');
            $table->boolean('whatsapp_active')->default(false)->after('phone_number');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Hapus kolom jika rollback
            $table->dropColumn(['nik', 'phone_number', 'whatsapp_active']);
        });
    }
};
