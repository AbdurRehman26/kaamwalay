<?php

namespace App\Exceptions\API\Admin;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CardDataIsMissing extends Exception
{
    /** @var string */
    protected $message = 'Card can not be created because there is information missing.';

    /** @var int */
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
