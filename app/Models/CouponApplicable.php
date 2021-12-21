<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CouponApplicable extends Model
{
    use HasFactory;

    const FOR_USERS = 1;
    const FOR_PAYMENT_PLANS = 2;
    const COUPON_APPLICABLE_WITH_ENTITIES = [
        self::FOR_USERS,
        self::FOR_PAYMENT_PLANS,
    ];
    const ENTITIES_MAPPING = [
        self::FOR_USERS => 'users',
        self::FOR_PAYMENT_PLANS => 'payment_plans',
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
