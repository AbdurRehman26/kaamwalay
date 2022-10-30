<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesmanCommission extends Model
{
    protected $fillable = [
        'salesman_id',
        'event_at',
        'commission'
    ];
}
