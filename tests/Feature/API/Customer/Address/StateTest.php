<?php

namespace Tests\Feature\API\Customer\Address;

use App\Models\State;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StateTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    /**
     * @test
     * @return void
     */
    public function a_user_can_see_states()
    {
        $this->actingAs($this->user);

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
        $this->actingAs($this->user);

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

    /** @test */
    public function a_guest_cannot_get_states()
    {
        $response = $this->getJson('/api/customer/addresses/states/');

        $response->assertUnauthorized();
    }
}
