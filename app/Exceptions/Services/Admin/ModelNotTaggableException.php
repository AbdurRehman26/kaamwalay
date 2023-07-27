<?php

namespace App\Exceptions\Services\Admin;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ModelNotTaggableException extends Exception
{
    /** @var string */
    protected $message = 'Model is not taggable. Implement Taggable interface on model.';

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
