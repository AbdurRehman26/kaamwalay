<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Robograding Application
    |--------------------------------------------------------------------------
    |
    | This file is for storing the application level custom configurations related to
    | robograding application.
    |
    */
    'feature_order_extra_charge_enabled' => env('FEATURE_ORDER_EXTRA_CHARGE_ENABLED', false),

    'discounted_price_admins' => env('DISCOUNTED_PRICE_ADMINS', []),
];
