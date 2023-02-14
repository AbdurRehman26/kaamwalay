<?php

namespace App\Services\ReferralProgram;

use App\Models\Order;
use App\Models\Referrer;
use App\Models\ReferrerEarnedCommission;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Collection;
use Spatie\QueryBuilder\QueryBuilder;

class ReferrerService
{
    protected const DEFAULT_PAGE_SIZE = 10;

    public function create(User $user): Referrer
    {
        try {
            $code = ReferralCodeGeneratorService::generate();

            $referrer = Referrer::create(['user_id' => $user->id, 'referral_code' => $code]);
        } catch(QueryException $e) {
            report($e);
            $referrer = $this->create($user);
        }

        return $referrer;
    }

    /**
     * @param  int  $referrerId
     * @return LengthAwarePaginator
     */
    // @phpstan-ignore-next-line
    public function getSignUps(int $referrerId): LengthAwarePaginator
    {
        $query = User::where('referred_by', $referrerId);
        $itemsPerPage = request('per_page') ?? self::DEFAULT_PAGE_SIZE;

        return QueryBuilder::for($query)
            ->allowedSorts(['created_at'])
            ->defaultSort('-users.created_at')
            ->paginate($itemsPerPage);
    }

    /**
     * @param  int  $referrerId
     * @return LengthAwarePaginator
     */
    // @phpstan-ignore-next-line
    public function getCommissionEarnings(int $referrerId): LengthAwarePaginator
    {
        $query = Order::join('referrer_earned_commissions', 'orders.id', 'referrer_earned_commissions.order_id')
            ->join('referrers', 'referrer_earned_commissions.referrer_id', 'referrers.id')
            ->selectRaw('SUM(referrer_earned_commissions.commission) as commission')
            ->addSelect('orders.*')->where('referrers.user_id', $referrerId)->groupBy('orders.id');
        $itemsPerPage = request('per_page') ?? self::DEFAULT_PAGE_SIZE;

        return QueryBuilder::for($query)
            ->allowedSorts(['created_at'])
            ->defaultSort('-orders.created_at')
            ->paginate($itemsPerPage);
    }

    /**
     * @param  int $referrerId
     * @param  int $refereeId
     * @return Collection<int, ReferrerEarnedCommission>
     */
    public function getEarnedCommissionsByReferee(int $referrerId, int $refereeId): Collection
    {
        return ReferrerEarnedCommission::join('orders', 'orders.id', 'referrer_earned_commissions.order_id')
            ->join('referrers', 'referrers.id', 'referrer_earned_commissions.referrer_id')
            ->where('orders.user_id', $refereeId)
            ->where('referrers.user_id', $referrerId)
            ->select('referrer_earned_commissions.*')->get();
    }

    public function getTotalReferrerCommissionsByReferee(int $referrerId, int $refereeId): float
    {
        return $this->getEarnedCommissionsByReferee($referrerId, $refereeId)->sum('commission');
    }

    public function increaseSuccessfulSignups(Referrer $referrer): void
    {
        $referrer->increment('successful_signups', 1);
    }

    public function increaseLinkClicks(Referrer $referrer): void
    {
        $referrer->increment('link_clicks', 1);
    }
}
