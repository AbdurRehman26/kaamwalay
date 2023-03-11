<?php

use App\Models\Referrer;
use App\Models\ReferrerPayout;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function PHPUnit\Framework\assertEquals;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()->withRole(config('permission.roles.customer'))->create();
    $this->referrerPayouts = ReferrerPayout::factory()->count(5)->create([
        'user_id' => $this->user->id,
    ]);
    $this->referrer = Referrer::factory()->create([
        'user_id' => $this->user->id,
    ]);
});

test('a referrer can withdraw his commission', function () {
    actingAs($this->user);

    postJson(route('v3.payouts.store', [
            'payout_account' => $this->faker->email(),
        ]))
        ->assertSuccessful()
        ->assertJsonStructure(['data' => [
            'payout_account',
            'status',
            'created_at',
            'completed_at',
        ]]);
});

test('a referrer can get his own payouts', function () {
    actingAs($this->user);
    getJson(route('v3.payouts.index'))
        ->assertSuccessful()
        ->assertJsonCount(5, ['data'])
        ->assertJsonStructure(['data' => [
            '*' => [
                'payout_account',
                'status',
                'created_at',
                'completed_at',
            ],
        ]]);
});

test('a referrer can not get another referrer`s payouts', function () {
    ReferrerPayout::factory()->count(5)->create([
        'user_id' => User::factory()->create(),
    ]);

    actingAs($this->user);
    $response = getJson(route('v3.payouts.index'))
        ->assertSuccessful()
        ->assertJsonCount(5, ['data'])
        ->assertJsonStructure(['data' => [
            '*' => [
                'payout_account',
                'status',
                'created_at',
                'completed_at',
            ],
        ]]);

    assertEquals(
        ReferrerPayout::orderBy('created_at', 'DESC')->where('user_id', $this->user->id)->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns payouts order by ASC created_at', function () {
    actingAs($this->user);

    $response = getJson(route('v3.payouts.index', ['sort' => 'created_at']))->assertOk();

    $this->assertEquals(
        ReferrerPayout::orderBy('created_at')->limit(10)->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns payouts order by DESC created_at', function () {
    actingAs($this->user);

    $response = getJson(route('v3.payouts.index', ['sort' => '-created_at']))->assertOk();

    $this->assertEquals(
        ReferrerPayout::orderBy('created_at', 'DESC')->limit(5)->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});
