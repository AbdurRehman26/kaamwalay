<?php

namespace Tests\Feature\Services;

use App\Http\APIClients\HubspotClient;
use App\Models\HubspotDeal;
use App\Models\User;
use Mockery;

use function Pest\Laravel\assertDatabaseCount;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->mock = Mockery::mock(HubspotClient::class);

    $this->sampleHubspotContactResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/Hubspot_create_contact_response_200.json'
    ), associative: true);

    $this->sampleHubspotDealResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/Hubspot_create_deal_response_200.json'
    ), associative: true);
});

test('sends new user to hubspot', function () {

    $this->mock->shouldReceive('addUserAndAssignDeal')->with($this->user)->andReturn($this->sampleHubspotContactResponse);

});

test('create deal on hubspot', function () {
    $this->mock->shouldReceive('createDeal')->andReturn($this->sampleHubspotDealResponse);

    HubspotDeal::create([
        'deal_name' => 'Test Deal',
        'deal_id' => '044855',
    ]);

    assertDatabaseCount('hubspot_deals', 1);
});




