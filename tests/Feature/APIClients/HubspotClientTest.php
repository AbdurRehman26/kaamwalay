<?php

namespace Tests\Feature\Services;

use App\Http\APIClients\HubspotClient;
use App\Models\User;
use Mockery;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->mock = Mockery::mock(HubspotClient::class);

    $this->sampleHubspotContactResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/Hubspot_create_contact_response_200.json'
    ), associative: true);
});

test('sends new user to hubspot', function () {

$this->mock->shouldReceive('addUserAndAssignDeal')->with($this->user)->andReturn($this->sampleHubspotContactResponse);

});




