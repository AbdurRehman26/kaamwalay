<?php

namespace App\Exceptions\API\Admin\Coupon;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CouponableEntityNotImplementedException extends Exception
{
    /** @var string */
    protected $message = 'Requested entity is not yet implemented';
    /** @var int */
    protected $code = Response::HTTP_NOT_IMPLEMENTED;

    /**
     * @param Request|array $request
     * @return JsonResponse
     */
    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
