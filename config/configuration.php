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
        'collector_coin_discount_percentage' => [
            'value' => env('COLLECTOR_COIN_DISCOUNT_PERCENTAGE', 0),
        ],
        'stripe_key' => [
            'auth' => true,
            'value' => env('STRIPE_KEY'),
        ],
        'algolia_app_id' => [
            'auth' => true,
            'value' => env('ALGOLIA_APP_ID'),
        ],
        'algolia_public_key' => [
            'auth' => true,
            'value' => env('ALGOLIA_PUBLIC_KEY'),
        ],
        'google_analytics_tracking_code' => [
            'value' => env('GOOGLE_ANALYTICS_TRACKING_CODE'),
        ],
        'paypal_client_id' => [
            'auth' => true,
            'value' => env('PAYPAL_CLIENT_ID'),
        ],
        'web3' => [
            'supported_networks' => env('WEB3_SUPPORTED_NETWORKS'),
            'testnet_token_value' => env('WEB3_TESTNET_TOKEN_VALUE'),
            'bsc_wallet' => env('BSC_WALLET'),
            'eth_wallet' => env('ETH_WALLET'),
            'test_wallet' => env('TEST_WALLET'),
        ]
    ],
];
