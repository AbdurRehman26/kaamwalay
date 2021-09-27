<?php

use App\Http\APIClients\MandrillClient;

it('sends email with template', function () {
    // Faking Mandrill API
    $mandrillResponse = [[
        'email' => 'test@test.com',
        'status' => 'sent',
        '_id' => '7f1f03dfcf5243d5a213873d738a0bd7',
        'reject_reason' => null,
    ]];
    Http::fake([
        'https://mandrillapp.com/api/*' => Http::response($mandrillResponse),
    ]);

    $response = resolve(MandrillClient::class)->sendEmailWithTemplate(
        'test@test.com',
        'Test Name',
        'Test Subject',
        'test_template',
        []
    );

    expect($response->body())->toBe(json_encode($mandrillResponse));
});
