<?php

namespace Tests\Unit;

use App\Models\CustomerAddress;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerAddressTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_scope_returns_only_specific_user_data()
    {
        $this->seed();
        $customerAddressA = CustomerAddress::factory()->create([
            'user_id' => 2,
        ]);
        $customerAddressB = CustomerAddress::factory()->create([
            'user_id' => 2,
        ]);
        $customerAddressC = CustomerAddress::factory()->create([
            'user_id' => 3,
        ]);

        $addresses = CustomerAddress::forUser(User::findOrFail(2))->get();

        $this->assertFalse($addresses->contains($customerAddressC));
        $this->assertTrue($addresses->contains($customerAddressB));
        $this->assertTrue($addresses->contains($customerAddressA));
    }
}
