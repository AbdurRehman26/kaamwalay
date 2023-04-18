<?php

namespace App\Exceptions\API\Admin\Order;

use Exception;

class OrderFoldersOnAGSLocalMachineNotCreated extends Exception
{
    protected $message = 'Order folders on AGS local machine could not be created.';
}
