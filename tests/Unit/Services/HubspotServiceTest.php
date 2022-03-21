<?php

namespace Tests\Feature\Services;

use App\Services\HubspotService;
use SevenShores\Hubspot\Http\Client;

it('can get client', function () {
    expect(resolve(HubspotService::class)->getClient())->toBeInstanceOf(Client::class);
});
