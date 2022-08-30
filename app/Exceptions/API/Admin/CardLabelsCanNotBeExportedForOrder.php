<?php

namespace App\Exceptions\API\Admin;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CardLabelsCanNotBeExportedForOrder extends Exception
{
    protected $message = 'Card labels can not be exported because Order is still not in graded status.';
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    public function render($request): JsonResponse
    {
        return new JsonResponse([ 'error' => $this->message ], $this->code);
    }
}
