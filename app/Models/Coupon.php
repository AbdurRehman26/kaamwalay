<?php

namespace App\Models;

use App\Casts\CouponDateRange;
use App\Casts\CouponType;
use App\Enums\Coupon\CouponMinThresholdTypeEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Coupon extends Model
{
    use HasFactory, SoftDeletes;

    const TYPE_FIXED = 1;
    const TYPE_PERCENTAGE = 2;
    const TYPE_FLAT = 3;
    const TYPE_FREE_CARDS = 4;
    const COUPON_TYPE_MAPPING = [
        'fixed' => self::TYPE_FIXED,
        'percentage' => self::TYPE_PERCENTAGE,
        'flat' => self::TYPE_FLAT,
        'free_cards' => self::TYPE_FREE_CARDS,
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
        'is_referred',
        'capped_amount',
        'available_from',
        'available_till',
        'coupon_status_id',
        'deleted_at',
        'min_threshold_type',
        'min_threshold_value',
    ];

    protected $casts = [
        'max_usage_allowed' => 'float',
        'usage_allowed_per_user' => 'float',
        'capped_amount' => 'float',
        'is_capped' => 'boolean',
        'type' => CouponType::class,
        'available_from' => CouponDateRange::class,
        'available_till' => CouponDateRange::class,
        'min_threshold_type' => CouponMinThresholdTypeEnum::class,
    ];

    /**
     * @param  Builder <Coupon> $query
     * @return Builder <Coupon>
     */
    public function scopeExcludeSystemGeneratedCoupons(Builder $query): Builder
    {
        return $query->where('is_referred', '=', 0);
    }

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

    /**
     * @return BelongsTo<User, Coupon>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
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

    public function isActive(): bool
    {
        return $this->coupon_status_id === CouponStatus::STATUS_ACTIVE;
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

        $query = $query->whereHas('couponAble', function ($subQuery) use ($couponParams) {
            $subQuery->where('couponables_id', '=', $couponParams['couponables_id']);
        })->orDoesntHave('couponAble');

        if (! empty($couponParams['user_id'])) {
            $query = $query->orWhereHas('couponAble', function ($subQuery) use ($couponParams) {
                $subQuery->where('couponables_id', '=', $couponParams['user_id'])
                    ->where('couponables_type', '=', Couponable::COUPONABLE_TYPES['user']);
            });
        }

        return $query;
    }

    public function scopeValidForUserLimit(Builder $query, string $couponCode, User $user):  Builder
    {
        return $query->whereNull('coupons.usage_allowed_per_user')
                ->orWhereNotExists(function ($subQuery) use ($couponCode, $user) {
                    $subQuery->from('coupons')
                        ->leftJoin('coupon_logs', 'coupon_logs.coupon_id', '=', 'coupons.id')
                        ->where('coupon_logs.user_id', '=', $user->id)
                        ->where('coupons.code', '=', $couponCode);
                });
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

    /**
     * @param  Builder <Coupon> $query
     * @return Builder <Coupon>
     */
    public function scopeNotCreatedBy(Builder $query, string|int $id): Builder
    {
        return $query->where('created_by', '!=', $id);
    }

    public function getCodeAttribute(string $value): string
    {
        return Str::upper($value);
    }

    public function setCodeAttribute(string $value): void
    {
        $this->attributes['code'] = Str::upper($value);
    }

    public static function getAllowedAdminIncludes(): array
    {
        return [
            'couponStatus',
            'couponApplicable',
            'couponStats',
            'couponLogs',
            'users',
            'paymentPlans',
            'createdBy',
        ];
    }

    public static function getAllowedSalesmanIncludes(): array
    {
        return [
            'couponStatus',
            'couponApplicable',
            'couponStats',
            'couponLogs',
            'users',
            'paymentPlans',
            'createdBy',
        ];
    }

    public function hasInvalidMinThreshold(int $itemsCount = 0): bool
    {
        return match ($this->min_threshold_type) {
            CouponMinThresholdTypeEnum::CARD_COUNT => $itemsCount < $this->min_threshold_value,
            default => false,
        };
    }

    public static function getRefereeCouponDiscount(): float
    {
        return config('robograding.feature_referee_coupon_discount');
    }
}
