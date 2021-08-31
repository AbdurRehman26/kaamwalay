<?php

use App\Models\CustomerAddress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

test('model scope returns only specific user data', function () {
    $customerAddressA = CustomerAddress::factory()->create();
    $customerAddressB = CustomerAddress::factory()->create();
    $customerAddressC = CustomerAddress::factory()->create();

    $addresses = CustomerAddress::forUser($customerAddressA->user)->get();

    $this->assertTrue($addresses->contains($customerAddressA));
    $this->assertFalse($addresses->contains($customerAddressB));
    $this->assertFalse($addresses->contains($customerAddressC));
});
