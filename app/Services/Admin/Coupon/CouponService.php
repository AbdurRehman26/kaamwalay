<?php

namespace App\Services\Admin\Coupon;

use App\Events\API\Admin\Coupon\NewCouponAdded;
use App\Exceptions\API\Admin\Coupon\CouponCodeAlreadyExistsException;
use App\Models\Coupon;
use App\Models\CouponStatus;
use App\Models\User;
use App\Services\Admin\Coupon\Contracts\CouponableEntityInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Spatie\QueryBuilder\QueryBuilder;
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
    public function storeCoupon(array $data, User $user): Coupon
    {
        $coupon = new Coupon(Arr::except(array: $data, keys: ['code']));

        $coupon->code = $this->getCouponCode($data['code']);
        $coupon->coupon_status_id = $this->getNewCouponStatus($coupon);
        $coupon->user_id = $user->id;

        $coupon->save();

        $this->addCouponStatusHistory($coupon, $this->getNewCouponStatus($coupon));

        $this->addCouponables($coupon, $data);

        NewCouponAdded::dispatch($coupon);

        return $coupon->refresh();
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

    protected function getNewCouponStatus(Coupon $coupon): int
    {
        if ($coupon->available_from->isPast()) {
            return CouponStatus::STATUS_ACTIVE;
        }

        return CouponStatus::STATUS_QUEUED;
    }

    protected function addCouponStatusHistory(Coupon $coupon, int $status): Coupon
    {
        $couponStatus = CouponStatus::forStatus($status)->first();

        return $this->couponStatusService->changeStatus($coupon, $couponStatus);
    }

    protected function addCouponables(Coupon $coupon, array $data): Coupon
    {
        $couponableManager = app(CouponableManager::class);
        
        $entityType = $this->getCouponableEntityFromRequest($data);
        /** @var CouponableEntityInterface $couponableEntity */
        $couponableEntity = $couponableManager->entity($entityType);

        return $couponableEntity
            ->setIds($data[$entityType])
            ->save($coupon);
    }

    protected function getCouponableEntityFromRequest(array $data): string
    {
        if (Arr::has($data, 'users')) {
            return 'users';
        }
        if (Arr::has($data, 'payment_plans')) {
            return 'payment_plans';
        }
    }
}
