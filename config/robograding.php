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

    'revenue_ignore_orders_admins' => env('REVENUE_IGNORE_ORDERS_ADMINS'),

    'collector_coin_discount_percentage' => env('COLLECTOR_COIN_DISCOUNT_PERCENTAGE', 0),

    'web3' => [
        'supported_networks' => env('WEB3_SUPPORTED_NETWORKS'),
        'testnet_token_value' => env('WEB3_TESTNET_TOKEN_VALUE', 1),
        'bsc_wallet' => env('BSC_WALLET'),
        'eth_wallet' => env('ETH_WALLET'),
        'test_wallet' => env('TEST_WALLET'),
    ],

    'feature_order_wallet_credit_enabled' => env('FEATURE_ORDER_WALLET_CREDIT_ENABLED'),
    'feature_order_wallet_credit_percentage' => env('FEATURE_ORDER_WALLET_CREDIT_PERCENTAGE'),
    'feature_order_cleaning_fee_per_card' => env('FEATURE_ORDER_CLEANING_FEE_PER_CARD'),
    'feature_order_cleaning_fee_max_cap' => env('FEATURE_ORDER_CLEANING_FEE_MAX_CAP'),
    'feature_order_shipping_insurance_fee_percentage' => env('FEATURE_ORDER_SHIPPING_INSURANCE_FEE_PERCENTAGE'),
    'feature_referral_discount_percentage' => env('FEATURE_REFERRAL_DISCOUNT_PERCENTAGE', 35),
    'feature_referral_max_discount_items' => env('FEATURE_REFERRAL_MAX_DISCOUNT_ITEMS', 20),
];
