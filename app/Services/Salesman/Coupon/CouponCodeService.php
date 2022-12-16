<?php

namespace App\Services\Salesman\Coupon;

use App\Exceptions\API\Admin\Coupon\CouponCodeAlreadyExistsException;
use App\Models\Coupon;
use Illuminate\Support\Str;

class CouponCodeService
{
    protected const COUPON_CODE_PREFIX = 'AGS';
    protected const COUPON_CODE_MAX_LENGTH = 12;
    protected const COUPON_LENGTH_WITHOUT_PREFIX = 9;

    public function exists(string $code): bool
    {
        return Coupon::where('code', $code)->exists();
    }

    /**
     * @throws CouponCodeAlreadyExistsException
     */
    public function newCoupon(string $code, bool $shouldSystemGenerate = false): string
    {
        if ($shouldSystemGenerate) {
            return $this->generateValidCoupon();
        }
        if ($this->exists($code)) {
            throw new CouponCodeAlreadyExistsException;
        }

        return $code;
    }

    private function generate(): string
    {
        return self::COUPON_CODE_PREFIX . Str::upper(Str::random(self::COUPON_LENGTH_WITHOUT_PREFIX));
    }

    private function generateValidCoupon(): string
    {
        do {
            $code = $this->generate();
            $exists = $this->exists($code);
        } while (! $exists);

        return $code;
    }
}
