<?php

namespace Tests\Feature\Services;

use App\Models\User;
use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\Response;

beforeEach(function () {
    $this->client = new Client();
    $this->user = User::factory()->create();

    $this->baseUrl = 'https://api.hubapi.com';
    $this->apiKey = '442f278d-7f4f-4655-a6b1-875a6ec3cf9a';
});

it('create deal', function () {
    $deal = [
            'properties' => [
                [
                  'value' => 'AGS',
                  'name' => 'dealname',
                ],
                [
                  'value' => 'ags_pipline',
                  'name' => 'pipeline',
                ],
            ],
        ];

    $response = $this->client->post($this->baseUrl .'/deals/v1/deal?hapikey=' . $this->apiKey, [
        'headers' => ['Content-Type' => 'application/json'],
        'body' => json_encode($deal),
    ]);

    $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
});

it('create contact', function () {
    $contact = [
            'properties' => [
                [
                    'property' => 'email',
                    'value' => $this->user->email ?: '',
                ],
                [
                    'property' => 'firstname',
                    'value' => $this->user->first_name ?: '',
                ],
                [
                    'property' => 'lastname',
                    'value' => $this->user->last_name ?: '',
                ],
            ],
        ];

    $response = $this->client->post($this->baseUrl .'/contacts/v1/contact?hapikey=' . $this->apiKey, [
        'headers' => ['Content-Type' => 'application/json'],
        'body' => json_encode($contact),
    ]);

    $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
});

it('associate contact to deal', function () {
    $response = $this->client->put($this->baseUrl . '/deals/v1/deal/8111314007/associations/CONTACT?id=1101&hapikey=' . $this->apiKey);
    $this->assertEquals(Response::HTTP_NO_CONTENT, $response->getStatusCode());
});
