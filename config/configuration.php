<?php
/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
| This configurations it serves to the configurations endpoint and service
| used to register keys that we will send to the frontend to allow app
| do its configuration.
| On the keys we are able to define alias keys, so for example by specifying
| `'ENV' => 'APP_ENV'` we will tell to the service that we want to create a
| property with the key `ENV` but value of `APP_ENV`.
|
| Note: Keys are converted to lowercase.
*/

return [
    /*
    |--------------------------------------------------------------------------
    | Cache TTL
    |--------------------------------------------------------------------------
    | This option will provide the Time to leave value to the cache
    */
    'ttl' => env('CONFIGURATION_CACHE_TTL', 86400),

    /*
    |--------------------------------------------------------------------------
    | Guest environment keys
    |--------------------------------------------------------------------------
    | This option will provide an array of key configurations that will be used
    | to fill the configuration object.
    |
    */
    'keys' => [
        'app_env' => [
            'value' => env('APP_ENV'),
        ],
        'app_url' => [
            'value' => env('APP_URL'),
        ],
        'stripe_key' => [
            'value' => env('STRIPE_KEY'),
        ],
        'algolia_app_id' => [
            'value' => env('ALGOLIA_APP_ID'),
        ],
        'algolia_public_key' => [
            'value' => env('ALGOLIA_PUBLIC_KEY'),
        ],
        'meilisearch_public_host' => [
            'value' => env('MEILISEARCH_PUBLIC_HOST'),
        ],
        'meilisearch_public_key' => [
            'value' => env('MEILISEARCH_PUBLIC_KEY'),
        ],
        'google_analytics_tracking_code' => [
            'value' => env('GOOGLE_ANALYTICS_TRACKING_CODE'),
        ],
        'paypal_client_id' => [
            'auth' => true,
            'value' => env('PAYPAL_CLIENT_ID'),
        ],
        'collector_coin_discount_percentage' => [
            'value' => env('COLLECTOR_COIN_DISCOUNT_PERCENTAGE', 0),
        ],
        'web3_supported_networks' => [
            'auth' => true,
            'value' => env('WEB3_SUPPORTED_NETWORKS'),
        ],
        'web3_testnet_token_value' => [
            'auth' => true,
            'value' => env('WEB3_TESTNET_TOKEN_VALUE'),
        ],
        'web3_bsc_wallet' => [
            'auth' => true,
            'value' => env('BSC_WALLET'),
        ],
        'web3_eth_wallet' => [
            'auth' => true,
            'value' => env('ETH_WALLET'),
        ],
        'web3_test_wallet' => [
            'auth' => true,
            'value' => env('TEST_WALLET'),
        ],
        'search_card_categories_customer' => [
            'value' => env('SEARCH_CARD_CATEGORIES_CUSTOMER'),
        ],
        'search_card_categories_admin' => [
            'auth' => true,
            'value' => env('SEARCH_CARD_CATEGORIES_ADMIN'),
        ],
        'feature_order_wallet_credit_enabled' => [
            'auth' => true,
            'value' => env('FEATURE_ORDER_WALLET_CREDIT_ENABLED'),
        ],
        'feature_order_wallet_credit_percentage' => [
            'auth' => true,
            'value' => env('FEATURE_ORDER_WALLET_CREDIT_PERCENTAGE'),
        ],
        'feature_order_cleaning_fee_per_card' => [
            'value' => env('FEATURE_ORDER_CLEANING_FEE_PER_CARD'),
        ],
        'feature_order_cleaning_fee_max_cap' => [
            'value' => env('FEATURE_ORDER_CLEANING_FEE_MAX_CAP'),
        ],
        'feature_order_shipping_insurance_fee_percentage' => [
            'value' => env('FEATURE_ORDER_SHIPPING_INSURANCE_FEE_PERCENTAGE'),
        ],
        'feature_referral_discount_percentage' => [
            'auth' => true,
            'value' => env('FEATURE_REFERRAL_DISCOUNT_PERCENTAGE'),
        ],
    ],
];
