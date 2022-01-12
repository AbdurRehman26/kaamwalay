<?php

namespace App\Exceptions\API\Wallet;

use Exception;
use Symfony\Component\HttpFoundation\Response;

class InvalidWalletTransactionException extends Exception
{
    /** @var string */
    protected $message = 'Invalid Wallet Transaction Type';

    /** @var int */
    protected $code = Response::HTTP_BAD_REQUEST;
}
