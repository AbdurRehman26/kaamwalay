<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CouponApplicable extends Model
{
    use HasFactory;

    const FOR_PAYMENT_PLANS = 2;
    const FOR_USERS = 3;
    const COUPON_APPLICABLE_WITH_ENTITIES = [
        self::FOR_PAYMENT_PLANS,
        self::FOR_USERS,
    ];
    const ENTITIES_MAPPING = [
        self::FOR_PAYMENT_PLANS => 'payment_plans',
        self::FOR_USERS => 'users',
    ];

    protected $fillable = [
        'code',
        'label',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function coupons(): HasMany
    {
        return $this->hasMany(Coupon::class);
    }

    public function scopeOnlyActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
