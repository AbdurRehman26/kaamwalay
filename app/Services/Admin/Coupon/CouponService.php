<?php

namespace App\Services\Admin\Coupon;

use App\Events\API\Admin\Coupon\NewCouponAdded;
use App\Models\Coupon;
use App\Services\Admin\Card\CouponCodeService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Spatie\QueryBuilder\QueryBuilder;
use App\Exceptions\API\Admin\Coupon\CouponCodeAlreadyExistsException;

class CouponService
{
    public function __construct(protected CouponCodeService $couponCodeService)
    {
    }

    public function getCoupons(): LengthAwarePaginator
    {
        return QueryBuilder::for(Coupon::class)
            ->allowedFilters([
                'status',
                'code',
            ])
            ->allowedSorts([
                'available_from',
                'available_till',
                'discount',
                'discount_value',
            ])
            ->defaultSort('-created_at')
            ->paginate(request('per_page', 15));
    }

    /**
     * @throws CouponCodeAlreadyExistsException
     */
    public function storeCoupon(array $data): Coupon
    {
        $coupon = new Coupon(Arr::except(array: $data, keys: ['code']));

        $coupon->code = $this->getCouponCode($data['code']);

        $coupon->save();

        NewCouponAdded::dispatch($coupon);

        return $coupon;
    }

    public function changeStatus(Coupon $coupon, string $status)
    {
        $coupon->update([
            'coupon_status_id' => $status,
        ]);
    }


    /**
     * @throws CouponCodeAlreadyExistsException
     */
    protected function getCouponCode(string $code): string
    {
        return $this->couponCodeService->newCoupon(code: $code);
    }
}
