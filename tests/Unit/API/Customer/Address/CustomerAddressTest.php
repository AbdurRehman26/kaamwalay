<?php

namespace Tests\Unit\API\Customer\Address;

use App\Models\CustomerAddress;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerAddressTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function model_scope_returns_only_specific_user_data()
    {
        $customerAddressA = CustomerAddress::factory()->create();
        $customerAddressB = CustomerAddress::factory()->create();
        $customerAddressC = CustomerAddress::factory()->create();

        $addresses = CustomerAddress::forUser(User::findOrFail(2))->get();

        $this->assertFalse($addresses->contains($customerAddressC));
        $this->assertTrue($addresses->contains($customerAddressB));
        $this->assertFalse($addresses->contains($customerAddressA));
    }
}
