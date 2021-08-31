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

    expect($addresses->contains($customerAddressA))->toBeTrue();
    expect($addresses->contains($customerAddressB))->toBeFalse();
    expect($addresses->contains($customerAddressC))->toBeFalse();
});
