<?php

namespace App\Exceptions\API\Customer\Coupon;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CouponCodeNotApplicable extends Exception
{
    /**
     * @var string
     */
    protected $message = 'Coupon code not applicable.';

    /**
     * @var int
     */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    public function render(Request $request): JsonResponse
    {
        return new JsonResponse(['error' => $this->message], $this->code);
    }
}
