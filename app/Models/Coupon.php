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
use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model
{
    use HasFactory, SoftDeletes;

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

    public function couponStatus()
    {
        return $this->belongsTo(CouponStatus::class);
    }

    public function couponApplicable(): BelongsTo
    {
        return $this->belongsTo(CouponApplicable::class);
    }

    public function couponAble(): HasOne
    {
        return $this->hasOne(Couponable::class, );
    }

    public function couponStats(): HasOne
    {
        return $this->hasOne(CouponStat::class);
    }

    public function couponLogs(): HasMany
    {
        return $this->hasMany(CouponLog::class);
    }

    public function scopeIsActive(Builder $query): Builder
    {
        return $query->where('coupon_status_id', '=', CouponStatus::STATUS_ACTIVE);
    }

    public function scopeValidOnCurrentDate(Builder $query): Builder
    {
        return $query->where('available_from', '<=', now())->where(function ($subQuery) {
            $subQuery->where('available_till', '>=', now())->orWhereNull('available_till');
        });
    }

    public function scopeValidOnCouponable(Builder $query, array $couponParams): Builder
    {
        if (empty($couponParams)) {
            return $query;
        }

        return $query->whereHas('couponAble', function ($subQuery) use ($couponParams) {
            $subQuery->where('couponables_type', '=', Couponable::COUPONABLE_TYPES[$couponParams['couponables_type']])
                    ->where('couponables_id', '=', $couponParams['couponables_id']);
        })->orDoesntHave('couponAble');
    }

    public function discountStatement()
    {
        return match ($this->type) {
            'percentage' => (int) $this->discount_value . '% Off ' . $this->couponApplicable?->label ?: '',
            default => $this->discount_value . ' Off',
        };
    }
}
