<?php

namespace App\Exceptions\API\Customer\Coupon;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CouponUsageLimitReachedException extends Exception
{
    /**
     * @var string
     */
    protected $message = 'This coupon can be used just once by a user.';

    /**
     * @var int
     */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    public function render(Request $request): JsonResponse
    {
        return new JsonResponse(['error' => $this->message], $this->code);
    }
}
