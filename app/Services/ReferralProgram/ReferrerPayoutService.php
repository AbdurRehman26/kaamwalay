<?php

namespace App\Services\ReferralProgram;

use App\Models\Referrer;
use App\Models\ReferrerPayout;
use App\Models\ReferrerPayoutStatus;
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

        return QueryBuilder::for(ReferrerPayout::class)
            ->allowedSorts(['initiated_at'])
            ->defaultSort('-initiated_at')
            ->with('payoutStatus')
            ->paginate($itemsPerPage);
    }

    public function create(array $data): ReferrerPayout
    {
        try {
            DB::beginTransaction();

            $referrer = Referrer::where('user_id', auth()->user()->id)->first();

            $referrerPayout = ReferrerPayout::create(
                array_merge(
                    $data,
                    [
                        'amount' => $referrer->withdrawable_commission,
                        'user_id' => auth()->user()->id,
                        'initiated_at' => now(),
                        'payment_method' => ReferrerPayout::DEFAULT_PAYMENT_METHOD,
                        'payout_status_id' => ReferrerPayoutStatus::STATUS_PENDING,
                    ]
                )
            );

            $referrer->withdrawable_commission = 0;
            $referrer->save();

            DB::commit();

            return $referrerPayout;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Payout creation error for customer', [
                'user_id' => auth()->user()->id,
            ]);
            Log::error($e->getMessage() . "\n File:" . $e->getFile() . "\n Line:" . $e->getLine());

            throw $e;
        }
    }
}
