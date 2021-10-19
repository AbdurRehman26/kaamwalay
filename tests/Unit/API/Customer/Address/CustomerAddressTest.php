<?php

use App\Models\CustomerAddress;

test('model scope returns only specific user data', function () {
    $customerAddressA = CustomerAddress::factory()->create();
    $customerAddressB = CustomerAddress::factory()->create();
    $customerAddressC = CustomerAddress::factory()->create();

    $addresses = CustomerAddress::forUser($customerAddressA->user)->get();

    expect($addresses->contains($customerAddressA))->not()->toBeTrue();
    expect($addresses->contains($customerAddressB))->toBeFalse();
    expect($addresses->contains($customerAddressC))->toBeFalse();
});
