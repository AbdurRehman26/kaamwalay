<?php

namespace App\Exceptions\API\Customer\Cards;

use Exception;

class CardDoesNotBelongToUser extends Exception
{
    protected $message = 'This card does not belong to that user.';
}
