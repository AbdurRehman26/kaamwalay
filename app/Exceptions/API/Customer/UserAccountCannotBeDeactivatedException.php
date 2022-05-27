<?php

namespace App\Exceptions\API\Customer;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserAccountCannotBeDeactivatedException extends Exception
{
    /**
     * @var string
     */
    protected $message = 'User account cannot be deactivated!';

    /**
     * @var int
     */
    protected $code = Response::HTTP_UNPROCESSABLE_ENTITY;

    public function render(Request $request): JsonResponse
    {
        return new JsonResponse(['error' => $this->message], $this->code);
    }
}
