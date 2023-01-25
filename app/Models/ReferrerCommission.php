<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReferrerCommission extends Model
{
    use HasFactory;

    protected $fillable = [
        'referrer_id',
        'event_at',
        'commission',
    ];
}
