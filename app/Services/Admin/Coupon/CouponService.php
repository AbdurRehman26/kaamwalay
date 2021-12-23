<?php

namespace App\Services\Admin\Coupon;

use App\Events\API\Admin\Coupon\NewCouponAdded;
use App\Exceptions\API\Admin\Coupon\CouponCodeAlreadyExistsException;
use App\Http\Filters\AdminCouponSearchFilter;
use App\Models\Coupon;
use App\Models\CouponApplicable;
use App\Models\CouponStat;
use App\Models\CouponStatus;
use App\Models\PaymentPlan;
use App\Models\User;
use App\Services\Admin\Coupon\Contracts\CouponableEntityInterface;
use Countable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;
use IteratorAggregate;
use Spatie\QueryBuilder\AllowedFilter;
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
                'code',
                AllowedFilter::scope('status'),
                AllowedFilter::custom('search', new AdminCouponSearchFilter),
            ])
            ->allowedSorts([
                'available_from',
                'available_till',
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
                'couponStat',
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
        $this->validateDiscountValue($data);
        $coupon = new Coupon(Arr::except(array: $data, keys: ['code']));

        $coupon->code = $this->getCouponCode($data['code']);
        $coupon->coupon_status_id = $this->getNewCouponStatus($coupon);
        $coupon->created_by = $user->id;

        $coupon->save();

        $this->addCouponStatusHistory($coupon, $this->getNewCouponStatus($coupon));

        $this->addCouponables($coupon, $data);

        $this->createCouponStats($coupon);

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
        /** @phpstan-ignore-next-line  */
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

    protected function createCouponStats(Coupon $coupon): void
    {
        $coupon->couponStats()->save(new CouponStat());
    }

    public function getCouponableEntities(int $couponApplicableId): Countable|IteratorAggregate
    {
        $couponableManager = app(CouponableManager::class);

        /** @var CouponableEntityInterface $couponableEntity */
        $couponableEntity = $couponableManager->entity(
            CouponApplicable::ENTITIES_MAPPING[$couponApplicableId]
        );

        return $couponableEntity->get();
    }

    protected function validateDiscountValue(array $data): void
    {
        if (
            $data['type'] === array_search(Coupon::TYPE_PERCENTAGE, Coupon::COUPON_TYPE_MAPPING)
        ) {
            $this->validatePercentageDiscountValue($data['discount_value']);

            return;
        }
        $this->validateFixedDiscountValue(
            $data['coupon_applicable_id'],
            $data['discount_value'],
            $data['couponables'] ?? []
        );
    }

    protected function validatePercentageDiscountValue(int|float $discountValue): void
    {
        if ($discountValue > 100) {
            throw ValidationException::withMessages([
                'discount_value' => 'Discount value can not be more than 100',
            ]);
        }
    }

    protected function validateFixedDiscountValue(
        int $couponApplicableId,
        int|float $discountValue,
        array $couponables
    ): void {
        if ($couponApplicableId === CouponApplicable::FOR_PAYMENT_PLANS) {
            $invalidCouponables = collect($couponables)->contains(function (int $couponable) use ($discountValue) {
                $couponable = PaymentPlan::find($couponable);

                return $discountValue > $couponable->price;
            });
            if ($invalidCouponables) {
                throw ValidationException::withMessages([
                    'discount_value' => 'Discount value can not be more than selected price level.',
                ]);
            }
        }
    }
}
