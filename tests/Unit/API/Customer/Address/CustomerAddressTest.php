<?php

namespace Tests\Unit\API\Customer\Address;

use Tests\TestCase;
use App\Models\CustomerAddress;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CustomerAddressTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function model_scope_returns_only_specific_user_data(): void
    {
        $customerAddressA = CustomerAddress::factory()->create();
        $customerAddressB = CustomerAddress::factory()->create();
        $customerAddressC = CustomerAddress::factory()->create();

        $addresses = CustomerAddress::forUser($customerAddressA->user)->get();

        $this->assertTrue($addresses->contains($customerAddressA));
        $this->assertFalse($addresses->contains($customerAddressB));
        $this->assertFalse($addresses->contains($customerAddressC));
    }
}
