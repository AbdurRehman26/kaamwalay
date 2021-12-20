<?php

namespace App\Exceptions\API\Admin\Coupon;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CouponAlreadyExistsException extends Exception
{
    protected $message = 'Coupon code already exists.';
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    /**
     * @param Request|array $request
     * @return JsonResponse
     */
    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
