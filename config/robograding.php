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

    'collector_coin_discount_percentage' => [
        'value' => env('COLLECTOR_COIN_DISCOUNT_PERCENTAGE', 10),
    ],

    'web3' => [
        'supported_networks' => env('WEB3_SUPPORTED_NETWORKS'),
        'testnet_token_value' => env('WEB3_TESTNET_TOKEN_VALUE', 1),
        'bsc_wallet' => env('BSC_WALLET'),
        'eth_wallet' => env('ETH_WALLET'),
        'test_wallet' => env('TEST_WALLET'),
    ]
];
