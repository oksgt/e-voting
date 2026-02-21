<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MagicLinks extends Model
{
    protected $table = 'magic_links';

    protected $fillable = [
        'user_id',
        'token',
        'expired_at',
    ];
}
