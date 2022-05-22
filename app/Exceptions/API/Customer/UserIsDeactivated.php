<?php

namespace App\Exceptions\API\Customer;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserIsDeactivated extends Exception
{
    /**
     * @var string
     */
    protected $message = 'User is deactivated!';

    /**
     * @var int
     */
    protected $code = Response::HTTP_UNAUTHORIZED;

    public function render(Request $request): JsonResponse
    {
        return new JsonResponse(['error' => $this->message], $this->code);
    }
}
