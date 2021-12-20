<?php

namespace App\Services\Admin\Card;

use App\Exceptions\API\Admin\Coupon\CouponAlreadyExistsException;
use App\Models\Coupon;
use Illuminate\Support\Str;

class CouponCodeService
{
    const COUPON_CODE_PREFIX = 'AGS';
    const COUPON_CODE_MAX_LENGTH = 12;
    const COUPON_LENGTH_WITHOUT_PREFIX = 9;

    public function exists(string $code): bool
    {
        return Coupon::where('code', $code)->exists();
    }

    /**
     * @throws CouponAlreadyExistsException
     */
    public function newCoupon(string $code, bool $shouldSystemGenerate = false): string
    {
        if ($shouldSystemGenerate === true) {
            return $this->generateValidCoupon();
        }
        if ($this->exists($code)) {
            throw new CouponAlreadyExistsException;
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
