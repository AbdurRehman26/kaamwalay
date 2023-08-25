<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'ags' => [
        'is_platform_enabled' => env('AGS_PLATFORM_ENABLED', false),
        'base_url' => env('AGS_BASE_URL'),
        'authorization_token' => env('AGS_AUTHORIZATION_TOKEN'),
        'local_machine_base_url' => env('AGS_LOCAL_MACHINE_BASE_URL'),
    ],

    'paypal' => [
        'client_id' => env('PAYPAL_CLIENT_ID'),
        'client_secret' => env('PAYPAL_CLIENT_SECRET'),
        'base_url' => env('PAYPAL_API_BASE_URL'),
    ],

    'slack' => [
        'channel_webhooks' => [
            'closes_ags' => env('SLACK_CHANNEL_WEBHOOK_CLOSES_AGS'),
            'ops_ags' => env('SLACK_CHANNEL_WEBHOOK_OPS_AGS'),
        ],
    ],

    'mandrill' => [
        'key' => env('MANDRILL_KEY'),
    ],

    'mailchimp' => [
        'api_key' => env('MAILCHIMP_API_KEY'),
        'server' => env('MAILCHIMP_SERVER'),
    ],

    'hubspot' => [
        'access_token' => env('HUBSPOT_ACCESS_TOKEN'),
        'owner_email' => env('HUBSPOT_OWNER_EMAIL'),
        'pipeline_id' => env('HUBSPOT_PIPELINE_ID'),
        'pipline_stage_id_new_signup' => env('HUBSPOT_PIPELINE_STAGE_ID_NEW_SIGNUP'),
        'pipline_stage_id_new_customer' => env('HUBSPOT_PIPELINE_STAGE_ID_NEW_CUSTOMER'),
        'pipline_stage_id_closed' => env('HUBSPOT_PIPELINE_STAGE_ID_CLOSED'),
    ],

    'dropbox' => [
        'app_key' => env('AGS_DROPBOX_APP_KEY'),
        'app_secret' => env('AGS_DROPBOX_APP_SECRET'),
        'refresh_token' => env('AGS_DROPBOX_APP_REFRESH_TOKEN'),
        'root_path' => env('AGS_DROPBOX_ROOT_PATH'),
    ],

    'facebook' => [
        'pixel_id' => env('FACEBOOK_PIXEL_ID'),
    ],

    'pusher' => [
        'beams_instance_id' => env('PUSHER_BEAMS_INSTANCE_ID'),
        'beams_secret_key' => env('PUSHER_BEAMS_SECRET_KEY'),
    ],

    'easyship' => [
        'key' => env('EASYSHIP_API_KEY'),
    ],

    'shipstation' => [
        'base_url' => env('SHIPSTATION_BASE_URL'),
        'api_key' => env('SHIPSTATION_API_KEY'),
        'api_secret' => env('SHIPSTATION_API_SECRET'),
        'store_id' => env('SHIPSTATION_STORE_ID'),
    ],
];
