<?php

namespace Tests\Unit\API\Customer\Address;

use App\Models\State;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StateTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     * @return void
     */
    public function a_user_can_see_states()
    {
        // @TODO Authenticate user and call on his behalf
        State::truncate();
        State::factory()
            ->count(5)
            ->create();
        $response = $this->getJson('/api/customer/addresses/states/');

        $response->assertJsonCount(5, 'data');
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'code', 'name'],
            ],
        ]);
    }

    /**
     * @test
     * @return void
     */
    public function a_user_can_see_specific_state()
    {
        // @TODO Authenticate user and call on his behalf
        State::truncate();
        State::factory()
            ->count(1)
            ->create();
        $response = $this->getJson('/api/customer/addresses/states/1');

        $response->assertJsonCount(3, 'data');
        $response->assertJsonStructure([
            'data' => ['id', 'code', 'name'],
        ]);
    }
}
