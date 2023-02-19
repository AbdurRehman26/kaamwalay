<?php

use App\Events\API\Auth\CustomerRegistered;
use App\Listeners\API\ReferralProgram\Referrer\GenerateReferrerOnCustomerRegister;
use App\Models\Order;
use App\Models\Referrer;
use App\Models\ReferrerEarnedCommission;
use App\Models\ReferrerPayout;
use App\Models\User;
use App\Services\ReferralProgram\ReferrerService;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

uses(WithFaker::class);

beforeEach(function () {
    $this->user = User::factory()->withRole(config('permission.roles.customer'))->create();
    $this->referrerPayouts = ReferrerPayout::factory()->count(20)->create([
        'user_id' => $this->user->id
    ]);
});

test('a referrer can get his own payouts', function () {

    actingAs($this->user);

    getJson(route('v3.payouts.index'))
        ->assertSuccessful()
        ->assertJsonCount(10, ['data'])
        ->assertJsonStructure(['data' => [
            '*' => [
                'date_initiated',
                'completed_at',
                'payout_account',
                'status',
            ],
        ]]);
});

it('returns payouts order by ASC date initiated', function () {
    actingAs($this->user);

    $response = getJson('/api/v3/customer/referrer/payouts?sort=initiated_at')->assertOk();

    $this->assertEquals(
        ReferrerPayout::orderBy('initiated_at')->limit(10)->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});

it('returns payouts order by DESC date initiated', function () {
    actingAs($this->user);

    $response = getJson('/api/v3/customer/referrer/payouts?sort=-initiated_at')->assertOk();

    $this->assertEquals(
        ReferrerPayout::orderBy('initiated_at', 'DESC')->limit(10)->pluck('id')->toArray(),
        collect($response->getData()->data)->pluck('id')->toArray()
    );
});
