<?php

namespace App\Exceptions\Services\Payment;

use Exception;

class InvoiceNotUploaded extends Exception
{
    protected $message = 'Invoice was not uploaded to cloud.';
}
