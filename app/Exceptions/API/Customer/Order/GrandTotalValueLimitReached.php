<?php

namespace App\Exceptions\API\Customer\Order;

use App\Services\Order\Validators\GrandTotalValidator;
use Exception;

class GrandTotalValueLimitReached extends Exception
{
    protected $message = 'Order grand total must not be greater than $' . GrandTotalValidator::MAX_GRAND_TOTAL_VALUE_PER_DB_SCHEMA .
    '. Please go back and update cards.';
}
