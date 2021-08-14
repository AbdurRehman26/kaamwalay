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
    | Guest environment keys
    |--------------------------------------------------------------------------
    | This option will provide an array of environment keys that will be
    | included for any session.
    */
    'guest_environment_keys' => [
        'APP_ENV',
        'APP_URL',
    ],

    /*
    |--------------------------------------------------------------------------
    | Auth environment keys
    |--------------------------------------------------------------------------
    | This option will provide an array of environment keys that will be
    | included for any auth session.
    */
    'auth_environment_keys' => [
        'ALGOLIA_APP_ID',
        'ALGOLIA_PUBLIC_KEY',
        'STRIPE_KEY',
    ],
];
