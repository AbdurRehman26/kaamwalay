<?php

namespace App\Services\ReferralProgram;

use App\Models\Order;
use App\Models\Referrer;
use App\Models\ReferrerEarnedCommission;
use App\Models\ReferrerPayout;
use App\Models\ReferrerPayoutStatus;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Spatie\QueryBuilder\QueryBuilder;

class ReferrerService
{
    protected const DEFAULT_PAGE_SIZE = 10;

    public function create(User $user): Referrer
    {
        try {
            $code = ReferralCodeGeneratorService::generate();

            $referrer = Referrer::create(['user_id' => $user->id, 'referral_code' => $code]);

        } catch (QueryException $e) {
            report($e);
            $referrer = $this->create($user);
        }

        return $referrer;
    }

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

    public function getTotalEarnedCommissionByReferrer(int $userId): float
    {
        return ReferrerEarnedCommission::join('referrers', 'referrers.id', 'referrer_earned_commissions.referrer_id')
            ->where('referrers.user_id', $userId)
            ->sum('commission');
    }

    public function setReferrersStatus(int $referrerId, array $data): Referrer
    {
        try {
            $referrer = Referrer::where('user_id', $referrerId)->first();
            $referrer->is_referral_active = $data['is_referral_active'];
            $referrer->save();

            return $referrer;
        } catch (Exception $e) {
            Log::error($e->getMessage());

            throw $e;
        }
    }

    public function getReferrerStat(User $user, array $data): float
    {
        $now = Carbon::now();

        switch ($data['time_filter']) {
            case 'this_month':
                $startDate = $now->copy()->startOfMonth()->toDateString();
                $endDate = $now->copy()->endOfMonth()->toDateString();

                break;
            case 'last_month':
                $startDate = $now->copy()->subMonth()->startOfMonth()->toDateString();
                $endDate = $now->copy()->subMonth()->endOfMonth()->toDateString();

                break;
            case 'this_year':
                $startDate = $now->copy()->startOfYear()->toDateString();
                $endDate = $now->copy()->endOfYear()->toDateString();

                break;
            case 'last_year':
                $startDate = $now->copy()->subYear()->startOfYear()->toDateString();
                $endDate = $now->copy()->subYear()->endOfYear()->toDateString();

                break;
            case 'custom':
                $startDate = $data['start_date'];
                $endDate = $data['end_date'];

                break;
            default:
                return 0;
        }

        $startDate .= ' 00:00:00';
        $endDate .= ' 23:59:59';

        switch ($data['stat_name']) {
            case 'orders':
                return $this->getTotalOrdersOfReferees($user->id, $startDate, $endDate);
            case 'sales':
                return $this->getTotalSalesOfReferees($user->id, $startDate, $endDate);
            case 'cards':
                return $this->getTotalCardsOfReferees($user->id, $startDate, $endDate);
            case 'commission_earned':
                return $this->getTotalEarnedCommission($user->id, $startDate, $endDate);
            case 'withdrawable_commission':
                return $this->getTotalWithdrawableCommission($user->id);
            case 'commission_paid':
                return $this->getTotalCommissionPaid($user->id, $startDate, $endDate);
            default:
                return 0;
        }
    }

    protected function getTotalOrdersOfReferees(int $userId, string $startDate, string $endDate): int
    {
        return Order::join('users', 'users.id', 'orders.user_id')
            ->where('users.referred_by', $userId)
            ->paid()
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->count();
    }

    protected function getTotalSalesOfReferees(int $userId, string $startDate, string $endDate): float
    {
        return Order::join('users', 'users.id', 'orders.user_id')
            ->where('users.referred_by', $userId)
            ->paid()
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->sum('grand_total');
    }

    protected function getTotalCardsOfReferees(int $userId, string $startDate, string $endDate): int
    {
        return Order::join('users', 'users.id', 'orders.user_id')
            ->join('order_items', 'order_items.order_id', 'orders.id')
            ->paid()
            ->where('users.referred_by', $userId)
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->count();
    }

    protected function getTotalEarnedCommission(int $userId, string $startDate, string $endDate): float
    {
        return ReferrerEarnedCommission::join('referrers', 'referrers.id', 'referrer_earned_commissions.referrer_id')
            ->where('referrers.user_id', $userId)
            ->whereBetween('referrer_earned_commissions.created_at', [$startDate, $endDate])
            ->sum('commission');
    }

    protected function getTotalWithdrawableCommission(int $userId): float
    {
        return Referrer::where('user_id', $userId)->sum('withdrawable_commission');
    }

    protected function getTotalCommissionPaid(int $userId, string $startDate, string $endDate): float
    {
        return ReferrerPayout::where('user_id', $userId)
            ->where('referrer_payout_status_id', ReferrerPayoutStatus::STATUS_COMPLETED)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('amount');
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
