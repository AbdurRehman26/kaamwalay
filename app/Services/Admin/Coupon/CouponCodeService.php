<?php

namespace App\Services\Admin\Coupon;

use App\Exceptions\API\Admin\Coupon\CouponCodeAlreadyExistsException;
use App\Models\Coupon;
use Illuminate\Support\Str;

class CouponCodeService
{
    protected const COUPON_LENGTH_WITHOUT_PREFIX = 9;
    protected int $couponLength = self::COUPON_LENGTH_WITHOUT_PREFIX;

    public function exists(string $code): bool
    {
        return Coupon::where('code', $code)->exists();
    }

    private function setCouponLength(int $length = -1): void
    {
        $this->couponLength = $length > 0 ? $length : $this->couponLength;
    }

    /**
     * @throws CouponCodeAlreadyExistsException
     */
    public function newCoupon(string $code, bool $shouldSystemGenerate = false, int $length = -1): string
    {
        if ($shouldSystemGenerate) {
            $this->setCouponLength($length);

            return $this->generateValidCoupon();
        }
        if ($this->exists($code)) {
            throw new CouponCodeAlreadyExistsException;
        }

        return $code;
    }

    private function generate(): string
    {
        return Str::upper(Str::random($this->couponLength));
    }

    private function generateValidCoupon(): string
    {
        do {
            $code = $this->generate();
            $exists = $this->exists($code);
        } while ($exists);

        return $code;
    }
}
