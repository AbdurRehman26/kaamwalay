<?php

namespace App\Exceptions\API\Customer\Coupon;

use App\Enums\Coupon\CouponMinThresholdTypeEnum;
use App\Models\Coupon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class CouponHasInvalidMinThreshold extends Exception
{
    public function __construct(protected int $itemsCount)
    {
    }

    /**
     * @var string
     */
    protected $message = 'You must have a minimum of %d cards in your submission to use this code.';

    /**
     * @var int
     */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    public function render(Request $request): JsonResponse
    {
        return new JsonResponse([
            'error' => sprintf($this->message, $this->itemsCount),
        ], $this->code);
    }

//    protected function getCouponMinimumThresholdAmount(): string|int
//    {
//        return $this->coupon->min_threshold_type === CouponMinThresholdTypeEnum::CARD_COUNT
//            ? $this->coupon->min_threshold_value
//            : '$' . $this->coupon->min_threshold_value;
//    }
//
//    protected function getCouponMinimumThresholdType()
//    {
//        return $this->coupon->min_threshold_type === CouponMinThresholdTypeEnum::CARD_COUNT
//            ? 'cards'
//            : 'grand total';
//    }
}
