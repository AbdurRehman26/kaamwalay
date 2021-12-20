<?php

namespace App\Services\Admin\Coupon;

use App\Models\Coupon;
use App\Models\CouponStatus;
use App\Models\CouponStatusHistory;
use Illuminate\Database\Eloquent\Builder;

class CouponStatusService
{
    public function changeStatus(Coupon $coupon, Builder|CouponStatus $newCouponStatus, string $referrer = 'admin'): Coupon
    {
        $coupon->coupon_status_id = $newCouponStatus->id;
        $coupon->save();

        $this->createStatusHistory($coupon, $referrer);

        return $coupon;
    }

    protected function createStatusHistory(Coupon $coupon, string $referrer): void
    {
        CouponStatusHistory::create([
            'coupon_status_id' => $coupon->coupon_status_id,
            'coupon_id' => $coupon->id,
            'notes' => $this->getChangeStatusNotes($referrer),
        ]);
    }

    protected function getChangeStatusNotes(string $referrer): string
    {
        return match ($referrer) {
            'admin' => 'Admin changed status.',
            default => 'System changed status',
        };
    }
}
