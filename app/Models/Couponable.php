<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Couponable extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'related_model',
        'api_suffix',
        'is_active',
    ];

    public function coupons(): HasMany
    {
        return $this->hasMany(Coupon::class);
    }
}
