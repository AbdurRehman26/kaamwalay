<?php

namespace App\Exceptions\API;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class FeatureNotAvailable extends Exception
{
    protected $code = Response::HTTP_SERVICE_UNAVAILABLE;

    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
