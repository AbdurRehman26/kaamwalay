<?php

namespace App\Services\Admin\Coupon;

use App\Events\API\Admin\Coupon\NewCouponAdded;
use App\Models\Coupon;
use App\Models\CouponStatus;
use App\Services\Admin\Card\CouponCodeService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Spatie\QueryBuilder\QueryBuilder;
use App\Exceptions\API\Admin\Coupon\CouponCodeAlreadyExistsException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class CouponService
{
    const LIST_COUPONS_PER_PAGE = 15;

    public function __construct(
        protected CouponCodeService $couponCodeService,
        protected CouponStatusService $couponStatusService
    ) {
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
            ->allowedIncludes([
                'couponStatus',
                'couponApplicable',
                'couponStats',
                'couponLogs',
                'users',
                'paymentPlans',
            ])
            ->defaultSort('-created_at')
            ->paginate(request('per_page', self::LIST_COUPONS_PER_PAGE));
    }



    public function getCoupon(int $couponId): Model|QueryBuilder
    {
        return QueryBuilder::for(Coupon::class)
            ->allowedIncludes([
                'couponStatus',
                'couponApplicable',
                'couponStats',
                'couponLogs',
                'users',
                'paymentPlans',
            ])
            ->findOrFail($couponId);
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

    public function changeStatus(Coupon $coupon, string|int $status): Coupon
    {
        if ($coupon->isExpired()) {
            throw new UnprocessableEntityHttpException('Status of expired coupon can not be changed');
        }

        $couponStatus = CouponStatus::forStatus($status)->first();

        return $this->couponStatusService->changeStatus($coupon, $couponStatus);
    }


    /**
     * @throws CouponCodeAlreadyExistsException
     */
    protected function getCouponCode(string $code): string
    {
        return $this->couponCodeService->newCoupon(code: $code);
    }
}
