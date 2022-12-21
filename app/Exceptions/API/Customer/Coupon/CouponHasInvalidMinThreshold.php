<?php

namespace App\Exceptions\API\Customer\Coupon;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CouponHasInvalidMinThreshold extends Exception
{
    public function __construct(protected int $itemsCount)
    {
        $this->message = sprintf('You must have a minimum of %d cards in your submission to use this code.', $this->itemsCount);
    }

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
}
