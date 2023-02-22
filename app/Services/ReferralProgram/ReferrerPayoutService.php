<?php

namespace App\Services\ReferralProgram;

use App\Models\Referrer;
use App\Models\ReferrerPayout;
use App\Models\ReferrerPayoutStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PHPUnit\Exception;
use Spatie\QueryBuilder\QueryBuilder;

class ReferrerPayoutService
{
    protected const DEFAULT_PAGE_SIZE = 10;

    /**
     * @return LengthAwarePaginator<Model>
     */
    public function getReferrerPayouts(): LengthAwarePaginator
    {
        $itemsPerPage = request('per_page') ?? self::DEFAULT_PAGE_SIZE;
        /* @var User $user */
        $user = auth()->user();

        return QueryBuilder::for(ReferrerPayout::forUser($user))
            ->allowedSorts(['created_at'])
            ->defaultSort('-created_at')
            ->with('referrerPayoutStatus')
            ->paginate($itemsPerPage);
    }

    /**
     * @throws \Throwable
     * @throws Exception
     */
    public function create(array $data): ReferrerPayout
    {
        $userId = auth()->user()->id;

        try {
            $referrer = Referrer::where('user_id', $userId)->first();

            DB::beginTransaction();

            $referrerPayout = ReferrerPayout::create(
                array_merge(
                    $data,
                    [
                        'amount' => $referrer->withdrawable_commission,
                        'user_id' => auth()->user()->id,
                        'initiated_at' => now(),
                        'payment_method' => ReferrerPayout::DEFAULT_PAYMENT_METHOD,
                        'referrer_payout_status_id' => ReferrerPayoutStatus::STATUS_PENDING,
                    ]
                )
            );

            $referrer->withdrawable_commission = 0;
            $referrer->save();

            DB::commit();

            return $referrerPayout;
        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Referrer payout creation failed for customer', [
                'user_id' => $userId,
                'message' => $e->getMessage() . "\n File:" . $e->getFile() . "\n Line:" . $e->getLine(),
            ]);

            throw $e;
        }
    }
}
