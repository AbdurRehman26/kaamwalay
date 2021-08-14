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
    | This option will provide an array of environment keys that will be used
    | to fill the configuration object.
    |
    | Template: '$key[:$option,$arg1,$arg2]'
    | Examples:
    | [
    |    'APP_ENV:env'      // Get the APP_ENV from environment.
    |    'APP_ENV:auth'     // Include the key only if user it's authenticated.
    |    'APP_ENV:env:auth' // Include the key on auth from env.
    |    'APP_ENV'          // Similar to 'APP_ENV' one.
    | ]
    */
    'keys' => [
        'APP_ENV',
        'APP_URL',
        'STRIPE_KEY:auth',
        'ALGOLIA_APP_ID:auth',
        'ALGOLIA_PUBLIC_KEY:auth',
    ],
];
