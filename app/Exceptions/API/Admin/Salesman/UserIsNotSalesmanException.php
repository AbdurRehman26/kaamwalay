<?php

namespace App\Exceptions\API\Admin\Salesman;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserIsNotSalesmanException extends Exception
{
    /** @var string */
    protected $message = 'User is not a sales representative.';

    /** @var int */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    /**
     * @param  Request|array  $request
     */
    public function render($request): JsonResponse
    {
        return new JsonResponse(['error' => $this->message], $this->code);
    }
}
