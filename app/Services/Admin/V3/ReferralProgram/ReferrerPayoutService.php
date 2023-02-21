<?php
namespace App\Services\Admin\V3\ReferralProgram;

use App\Models\ReferrerPayout;
use App\Services\ReferralProgram\ReferrerPayout\Providers\PaypalService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Spatie\QueryBuilder\QueryBuilder;

class ReferrerPayoutService
{
    protected const PER_PAGE = 10;
    /**
     * Payment Providers available for the application
     **/
    protected array $providers = [
        'PAYPAL' => PaypalService::class,
    ];

    /**
     * @param  array  $ids
     * @param  string  $paymentMethod
     * @return Collection<ReferrerPayout>
     */
    protected function getPayoutsByIdArray(array $ids, string $paymentMethod): Collection
    {
        return ReferrerPayout::whereIn('id', $ids)->where('payment_method', $paymentMethod)->get();
    }

    // @phpstan-ignore-next-line
    public function list(): LengthAwarePaginator
    {
        return QueryBuilder::for(ReferrerPayout::class)
            ->allowedFilters(ReferrerPayout::allowedFilters())
            ->defaultSort('-created_at')
            ->with(['user', 'paidBy', 'payoutStatus'])
            ->paginate(request('per_page', self::PER_PAGE));
    }

    public function process(array $data): void
    {
        foreach (array_keys($this->providers) as $paymentMethod) {
            $payouts = $this->getPayoutsByIdArray($data['items'], $paymentMethod);

            if (count($payouts) > 0) {
                $response = resolve($this->providers[
                    $paymentMethod
                ])->pay($payouts->toArray(), $data);

                \Log::debug('Create Batch', $response);

                $statusResponse = resolve($this->providers[
                    $paymentMethod
                ])->verify($response['payout_batch_id']);

                \Log::debug('Get Batch Status', $statusResponse);

                dd($response, $statusResponse);
            }
        }
    }
}
