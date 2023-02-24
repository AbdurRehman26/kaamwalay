<?php
namespace App\Services\Admin\V3\ReferralProgram;

use App\Models\ReferrerPayout;
use App\Models\ReferrerPayoutStatus;
use App\Services\ReferralProgram\ReferrerPayout\Providers\PaypalPayoutService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Log;
use Spatie\QueryBuilder\QueryBuilder;

class ReferrerPayoutService
{
    protected const PER_PAGE = 10;
    /**
     * Payment Providers available for the application
     **/
    protected array $providers = [
        'paypal' => PaypalPayoutService::class,
    ];

    /**
     * @param  array  $ids
     * @param  string  $paymentMethod
     * @return Collection<int, ReferrerPayout>
     */
    protected function getPayoutsByIdArray(array $ids, string $paymentMethod = ''): Collection
    {
        $query = ReferrerPayout::whereIn('id', $ids);

        if ($paymentMethod) {
            $query->where('payment_method', $paymentMethod);
        }

        return $query->get();
    }

    /**
     * @param  string  $paymentMethod
     * @return Collection<int, ReferrerPayout>
     */
    protected function getAllPendingPayouts(string $paymentMethod = ''): Collection
    {
        $query = ReferrerPayout::where('referrer_payout_status_id', ReferrerPayoutStatus::STATUS_PENDING)
            ->whereNull('transaction_id');

        if ($paymentMethod) {
            $query->where('payment_method', $paymentMethod);
        }

        return $query->get();
    }

    // @phpstan-ignore-next-line
    public function list(): LengthAwarePaginator
    {
        return QueryBuilder::for(ReferrerPayout::class)
            ->allowedFilters(ReferrerPayout::allowedFilters())
            ->allowedSorts(ReferrerPayout::allowedSorts())
            ->defaultSort('-created_at')
            ->with(['user', 'user.referrer', 'paidBy', 'referrerPayoutStatus'])
            ->paginate(request('per_page', self::PER_PAGE));
    }

    public function initiateBatchPayout(array $data): void
    {
        if (array_key_exists('all_pending', $data)) {
            $query = ReferrerPayout::where('referrer_payout_status_id', ReferrerPayoutStatus::STATUS_PENDING)
                ->whereNull('transaction_id');
        } else {
            $query = ReferrerPayout::whereIn('id', $data['items']);
        }
        //Set who initiated the payout batch
        $query->update([
            'paid_by' => auth()->user()->id,
            'initiated_at' => now(),
        ]);
    }

    public function processBatchPayout(array $data): void
    {
        foreach (array_keys($this->providers) as $paymentMethod) {
            if (array_key_exists('all_pending', $data)) {
                $payouts = $this->getAllPendingPayouts($paymentMethod);
            } else {
                $payouts = $this->getPayoutsByIdArray($data['items'], $paymentMethod);
            }

            Log::info('BATCH_PAYOUT_ITEMS', $payouts->pluck('id')->toArray());

            $paymentMethodService = resolve($this->providers[
                $paymentMethod
            ]);

            if (count($payouts) > 0) {
                $response = $paymentMethodService->pay($payouts->toArray(), $data);
                Log::info('CREATE_BATCH_PAYOUT', $response);

                if ($response['result'] === 'FAILED') {
                    $this->processFailedBatchPayouts($payouts, $response);
                } else {
                    $paymentMethodService->storeItemsResponse($payouts, $response);
                }
            }
        }
    }

    public function processPayoutHandshake(ReferrerPayout $payout): void
    {
        $response = resolve($this->providers[
            $payout->payment_method
        ])->handshake($payout);

        Log::info('PAYOUT_HANDSHAKE', $response);
    }

    /**
     * @param  Collection<int, ReferrerPayout>  $payouts
     * @param  array  $data
     * @return void
     */
    protected function processFailedBatchPayouts(Collection $payouts, array $data): void
    {
        ReferrerPayout::whereIn('id', $payouts->pluck('id'))->update([
            'request_payload' => $data['request'],
            'response_payload' => json_encode($data['response']),
            'referrer_payout_status_id' => ReferrerPayoutStatus::STATUS_FAILED,
        ]);

        foreach ($payouts as $payout) {
            $payout->user->referrer->increment('withdrawable_commission', $payout->amount);
        }
    }
}
