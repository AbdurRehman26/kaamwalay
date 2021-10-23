<?php

namespace App\Exceptions\API;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FeatureNotAvailable extends Exception
{
    /* @var int $code */
    protected $code = Response::HTTP_SERVICE_UNAVAILABLE;

    /**
     * @param Request|array $request
     * @return JsonResponse
     */
    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
