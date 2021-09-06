<?php

namespace App\Exceptions\API\Customer\Order;

use App\Services\Order\Validators\ItemsDeclaredValueValidator;
use Exception;

class ItemDeclaredValueLimitReached extends Exception
{
    protected $message = 'Total declared value of any card must not be greater than $' . ItemsDeclaredValueValidator::MAX_DECLARED_VALUE_PER_DB_SCHEMA .
    '. Please go back and update.';
}
