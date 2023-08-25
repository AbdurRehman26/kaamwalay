<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReferrerPayoutStatus extends Model
{
    const STATUS_PENDING = 1;

    const STATUS_PROCESSING = 2;

    const STATUS_COMPLETED = 3;

    const STATUS_FAILED = 4;

    protected $fillable = [
        'code',
        'name',
        'description',
    ];
}
