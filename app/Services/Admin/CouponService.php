<?php

namespace App\Services\Admin;

use App\Models\Coupon;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

class CouponService
{
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

    public function storeCoupon(array $data): Coupon
    {
        $coupon = Coupon::create($data);

        return $coupon;
    }

    public function changeStatus(Coupon $coupon, string $status)
    {
        $coupon->update([
            'coupon_status_id' => $status,
        ]);
    }
}
