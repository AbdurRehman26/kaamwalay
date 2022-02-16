<?php

namespace App\Exceptions\API\Customer\Coupon;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CouponFlatValueDiscountGreaterThanOrder extends Exception
{
    /**
     * @var string
     */
    protected $message = 'Coupon applied value is greater than your order. Please choose another coupon.';

    /**
     * @var int
     */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    public function render(Request $request): JsonResponse
    {
        return new JsonResponse(['error' => $this->message], $this->code);
    }
}
