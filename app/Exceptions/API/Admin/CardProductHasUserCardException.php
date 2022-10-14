<?php

namespace App\Exceptions\API\Admin;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CardProductHasUserCardException extends Exception
{
    /** @var string */
    protected $message = 'Card can not be deleted because it has a graded user card.';

    /** @var int */
    protected $code = Response::HTTP_FORBIDDEN;

    /**
     * @param Request|array $request
     * @return JsonResponse
     */
    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
