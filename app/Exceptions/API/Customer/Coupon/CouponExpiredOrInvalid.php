<?php

namespace App\Exceptions\API\Customer\Coupon;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class CouponExpiredOrInvalid extends Exception
{
    /**
     * @var string
     */
    protected $message = 'Coupon is either expired or invalid.';

    /**
     * @var int
     */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;
}
