<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Couponable extends Model
{
    use HasFactory;

    protected $fillable = [
        'couponable_id',
        'couponable_type',
        'coupon_id',
    ];
}
