<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesmanEarnedCommission extends Model
{
    protected $fillable = [
        'salesman_id',
        'order_id',
        'type',
        'commission',
    ];
}