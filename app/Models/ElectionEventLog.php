<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ElectionEventLog extends Model
{
    use SoftDeletes;

    protected $table = 'election_event_logs';

    protected $fillable = [
        'event_id',
        'user_id',
        'position_id',
        'voted_by',
        'voted_at',
    ];
}
