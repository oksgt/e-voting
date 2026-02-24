<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ElectionEvent extends Model
{
    protected $table = 'election_events';

    use SoftDeletes;

    protected $fillable = [
        'name',
        'keyword',
        'start_date',
        'duration',
        'is_autorun',
        'status',
        'is_running',
        'started_at',
        'finished_at',
    ];

    protected $casts = [
        'is_autorun' => 'boolean',
        'is_running' => 'boolean',
        'start_date' => 'datetime',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
    ];
}
