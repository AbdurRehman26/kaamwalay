<?php

namespace App\Services\ReferralProgram;

use App\Exceptions\API\Customer\Coupon\CouponExpiredOrInvalid;
use App\Models\Coupon;
use App\Models\Couponable;
use App\Models\CouponApplicable;
use App\Models\CouponStat;
use App\Models\CouponStatus;
use App\Models\User;
use App\Services\Admin\Coupon\CouponCodeService;
use App\Services\Admin\Coupon\CouponStatusService;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class RefereeCouponService
{
    private const MAX_DISCOUNT_APPLICABLE_ITEMS = 20;

    public function __construct(
        protected CouponCodeService $couponCodeService,
        protected CouponStatusService $couponStatusService
    ) {
    }

    /**
     * @throws Throwable
     */
    public function createRefereeCoupon(User $user): Coupon
    {
        try {
            DB::beginTransaction();

            $coupon = $this->generateCoupon($user);
            $this->addCouponStatusHistory($coupon, CouponStatus::STATUS_ACTIVE);
            $this->addCouponable($coupon, $user);
            $this->createCouponStats($coupon);
            $coupon->load('couponStatus', 'couponStats');

            DB::commit();

            return $coupon->refresh();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage()."\n File:".$e->getFile()."\n Line:".$e->getLine());

            throw $e;
        }
    }

    protected function generateCoupon(User $user): Coupon
    {
        $code = $this->couponCodeService->newCoupon('', true, 5);

        $coupon = new Coupon();
        $coupon->setRawAttributes(
            array_merge(
                [
                    'available_from' => now(),
                    'available_till' => now()->addDays(30),
                    'code' => $code,
                    'name' => $code,
                    'created_by' => $user->id,
                    'is_system_generated' => 1,
                    'max_discount_applicable_items' => self::MAX_DISCOUNT_APPLICABLE_ITEMS,
                ],
                $this->generateCouponData()
            )
        );

        $coupon->save();

        return $coupon;
    }

    protected function addCouponStatusHistory(Coupon $coupon, int $status): Coupon
    {
        $couponStatus = CouponStatus::forStatus($status)->first();

        return $this->couponStatusService->changeStatus($coupon, $couponStatus);
    }

    protected function generateCouponData(): array
    {
        return [
            'coupon_status_id' => CouponStatus::STATUS_ACTIVE,
            'type' => Coupon::TYPE_PERCENTAGE,
            'discount_value' => Coupon::getRefereeCouponDiscount(),
            'usage_allowed_per_user' => 1,
            'max_usage_allowed' => 1,
            'description' => 'Submission discount referred by an user',
            'coupon_applicable_id' => CouponApplicable::FOR_USERS,
        ];
    }

    protected function addCouponable(Coupon $coupon, User $user): bool
    {
        $couponable = new Couponable();
        $couponable->couponables_id = $user->id;
        $couponable->couponables_type = Couponable::COUPONABLE_TYPES['user'];
        $couponable->coupon_id = $coupon->id;

        return $couponable->save();
    }

    protected function createCouponStats(Coupon $coupon): void
    {
        $coupon->couponStats()->save(new CouponStat());
    }

    public function getRefereeCoupon(): ?object
    {
        $coupon = Coupon::validOnCurrentDate()->whereExists(function ($query) {
            $query->from('couponables')->whereColumn('couponables.couponables_id', 'coupons.created_by')
                ->where('coupons.created_by', auth()->user()->id);
        })->where('is_system_generated', 1);

        throw_if($coupon->doesntExist(), CouponExpiredOrInvalid::class);

        return $coupon->first();
    }
}
