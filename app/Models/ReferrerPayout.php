<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReferrerPayout extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'amount',
        'initiated_at',
        'completed_at',
        'request_payload',
        'response_payload',
        'payout_status_id',
        'paid_by_id',
    ];

}
