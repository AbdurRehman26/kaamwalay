<?php

namespace App\Services\Admin\Coupon;

use App\Events\API\Admin\Coupon\NewCouponAdded;
use App\Exceptions\API\Admin\Coupon\CouponableEntityNotImplementedException;
use App\Exceptions\API\Admin\Coupon\CouponCodeAlreadyExistsException;
use App\Models\Coupon;
use App\Models\CouponApplicable;
use App\Models\CouponStatus;
use App\Models\User;
use App\Services\Admin\Coupon\Contracts\CouponableEntityInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Spatie\QueryBuilder\QueryBuilder;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class CouponService
{
    const COUPONABLES_REQUEST_KEY = 'couponables';
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

    public function changeStatus(Coupon $coupon, string|int $status, string $referrer = 'admin'): Coupon
    {
        if ($coupon->isExpired()) {
            throw new UnprocessableEntityHttpException('Status of expired coupon can not be changed');
        }

        $couponStatus = CouponStatus::forStatus($status)->first();

        return $this->couponStatusService->changeStatus($coupon, $couponStatus, $referrer);
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
        if (in_array($data['coupon_applicable_id'], CouponApplicable::COUPON_APPLICABLE_WITH_ENTITIES)) {
            $couponableManager = app(CouponableManager::class);

            /** @var CouponableEntityInterface $couponableEntity */
            $couponableEntity = $couponableManager->entity(
                CouponApplicable::ENTITIES_MAPPING[$data['coupon_applicable_id']]
            );

            return $couponableEntity
                ->setIds($data[self::COUPONABLES_REQUEST_KEY])
                ->save($coupon);
        }

        return $coupon;
    }

    public function getQueuedCouponsNearingActivation(): Collection
    {
        return Coupon::where('coupon_status_id', CouponStatus::STATUS_QUEUED)
            ->where('available_from', '<=', now())
            ->get();
    }

    public function activateCoupons(Collection $coupons): void
    {
        $coupons->each(function ($coupon) {
            $this->changeStatus($coupon, CouponStatus::STATUS_ACTIVE, referrer: 'system');
        });
    }

    public function getCouponsNearingExpiry(): Collection
    {
        return Coupon::where('available_till', '<=', now())
            ->get();
    }

    public function expireCoupons(Collection $coupons): void
    {
        $coupons->each(function ($coupon) {
            $this->changeStatus($coupon, CouponStatus::STATUS_EXPIRED, referrer: 'system');
        });
    }
}
