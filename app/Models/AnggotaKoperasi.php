<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnggotaKoperasi extends Model
{
    use HasFactory;

    protected $table = 'anggota_koperasi';

    protected $fillable = [
        'nama',
        'nik',
        'bidang',
        'nowa',
    ];
}
