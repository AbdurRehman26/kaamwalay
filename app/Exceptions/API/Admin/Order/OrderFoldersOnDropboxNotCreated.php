<?php

namespace App\Exceptions\API\Admin\Order;

use Exception;

class OrderFoldersOnDropboxNotCreated extends Exception
{
    protected $message = 'Order folders on Dropbox could not be created.';
}
