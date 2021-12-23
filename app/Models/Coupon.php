<?php

namespace App\Models;

use App\Casts\CouponDateRange;
use App\Casts\CouponType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model
{
    use HasFactory, SoftDeletes;

    const TYPE_FIXED = 1;
    const TYPE_PERCENTAGE = 2;
    const COUPON_TYPE_MAPPING = [
        'fixed' => self::TYPE_FIXED,
        'percentage' => self::TYPE_PERCENTAGE,
    ];

    protected $fillable = [
        'created_by',
        'coupon_applicable_id',
        'code',
        'name',
        'description',
        'max_usage_allowed',
        'usage_allowed_per_user',
        'type',
        'discount_value',
        'is_capped',
        'capped_amount',
        'available_from',
        'available_till',
        'coupon_status_id',
        'deleted_at',
    ];

    protected $casts = [
        'max_usage_allowed' => 'float',
        'usage_allowed_per_user' => 'float',
        'capped_amount' => 'float',
        'is_capped' => 'boolean',
        'type' => CouponType::class,
        'available_from' => CouponDateRange::class,
        'available_till' => CouponDateRange::class,
    ];

    public function couponStatusHistories(): HasMany
    {
        return $this->hasMany(CouponStatusHistory::class);
    }

    public function couponStatus(): BelongsTo
    {
        return $this->belongsTo(CouponStatus::class);
    }

    public function couponApplicable(): BelongsTo
    {
        return $this->belongsTo(CouponApplicable::class);
    }

    public function couponStats(): HasOne
    {
        return $this->hasOne(CouponStat::class);
    }

    public function couponLogs(): HasMany
    {
        return $this->hasMany(CouponLog::class);
    }

    public function users(): MorphToMany
    {
        return $this->morphedByMany(User::class, 'couponables');
    }

    public function paymentPlans(): MorphToMany
    {
        return $this->morphedByMany(PaymentPlan::class, 'couponables');
    }

    public function isExpired(): bool
    {
        return $this->coupon_status_id === CouponStatus::STATUS_EXPIRED;
    }

    public function scopeStatus(Builder $query, string|int $status): Builder
    {
        return $query->whereHas(
            'couponStatus',
            function (Builder $query) use ($status) {
                if (! $status || $status === 'all') {
                    return $query;
                }

                return $query
                    ->where('id', $status)
                    ->orWhere('code', $status);
            }
        );
    }
}
