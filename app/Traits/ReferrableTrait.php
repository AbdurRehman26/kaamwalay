<?php

namespace App\Traits;

use App\Http\Filters\AdminCustomerSearchFilter;
use App\Http\Filters\AdminReferrerStatusFilter;
use App\Http\Sorts\AdminCustomerCardsSort;
use App\Http\Sorts\AdminCustomerFullNameSort;
use App\Http\Sorts\AdminCustomerSubmissionsSort;
use App\Http\Sorts\AdminCustomerWalletSort;
use App\Models\Referrer;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;

trait ReferrableTrait
{
    /**
     * @return BelongsTo<User, User>
     */
    public function referredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_by')->without('roles');
    }

    /**
     * @return HasOne<Referrer>
     */
    public function referrer(): HasOne
    {
        return $this->hasOne(Referrer::class, 'user_id', 'id');
    }

    /**
     * @return HasMany<User>
     */
    public function referees(): HasMany
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function getReferrerSubmissions(): int
    {
        return $this->referees()->join('orders', 'orders.user_id', 'users.id')->count();
    }

    public function getReferrerCardsCount(): int
    {
        return $this->referees()->join('orders', 'orders.user_id', 'users.id')
            ->join('order_items', 'order_items.order_id', 'orders.id')
            ->sum('quantity');
    }

    public function getReferrerSales(): float
    {
        return $this->referees()->join('orders', 'orders.user_id', 'users.id')->sum('grand_total');
    }

    public function getReferrerCommission(): float
    {
        return $this->referrer->earnedCommissions()->sum('commission');
    }

    public static function getAllowedAdminReferrerFilters(): array
    {
        return [
            AllowedFilter::custom('search', new AdminCustomerSearchFilter),
            AllowedFilter::scope('referrer_signed_up_between'),
            AllowedFilter::scope('referrer_submissions'),
            AllowedFilter::scope('salesman_id'),
            AllowedFilter::custom('is_referral_active', new AdminReferrerStatusFilter),
        ];
    }

    public static function getAllowedAdminReferrerSorts(): array
    {
        return  [
            AllowedSort::custom('submissions', new AdminCustomerSubmissionsSort),
            AllowedSort::custom('full_name', new AdminCustomerFullNameSort),
            AllowedSort::custom('wallet', new AdminCustomerWalletSort),
            AllowedSort::custom('cards', new AdminCustomerCardsSort),
            'email',
            'customer_number',
            'users.created_at',
        ];
    }

    /**
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function scopeReferrerSignedUpBetween(Builder $query, string $startDate, string $endDate): Builder
    {
        return $query->whereBetween('users.created_at', [Carbon::parse($startDate)->startOfDay(), Carbon::parse($endDate)->endOfDay()]);
    }

    /**
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function scopeReferrerSubmissions(Builder $query, string $minSubmissionCount, string $maxSubmissionCount): Builder
    {
        //this works for only level 1 referral, must be changed for multi level structure
        return $query->whereBetween('referrers.referral_orders', [$minSubmissionCount, $maxSubmissionCount]);
    }
}
