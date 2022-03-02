<?php

namespace Tests\Feature\Services;

use App\Models\User;
use App\Services\HubspotService;
use Mockery;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->mock = Mockery::mock(HubspotService::class);
});

test('sends new user to hubspot', function () {

    $this->mock->shouldReceive('addUserAndAssignDeal')->with($this->user)->andReturn([
        "reasonPhrase" => "No Content",
        "statusCode" => 204
    ]);

});
