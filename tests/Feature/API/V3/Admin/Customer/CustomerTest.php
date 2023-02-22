<?php

use App\Models\Order;
use App\Models\Referrer;
use App\Models\ReferrerEarnedCommission;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Database\Seeders\UsersSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
        UsersSeeder::class,
    ]);

    $this->referrer = Referrer::factory()->create();
    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->customer = User::factory()->withRole(config('permission.roles.customer'))->state(new Sequence(
        ['referred_by' => $this->referrer->user->id],
    ))->create();
});

test('an admin can see referral details of single customer', function () {
    actingAs($this->user);

    getJson(route('v3.admin.customer.referral.sign-ups', ['user' => $this->customer->referred_by]))
        ->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                [
                    'id',
                    'first_name',
                    'last_name',
                    'full_name',
                    'profile_image',
                    'signed_up_at',
                    'submissions',
                    'cards_count',
                    'total_spent',
                    'total_commissions',
                ],
            ],
        ]);
});

test('an admin can see commission details of single customer', function () {
    actingAs($this->user);

    $orders = Order::factory()->count(3)->state(new Sequence(
        ['user_id' => $this->customer->id],
        ['user_id' => $this->customer->id],
        ['user_id' => $this->customer->id],
    ))->create();

    ReferrerEarnedCommission::factory()->count(3)->state(new Sequence(
        ['referrer_id' => $this->referrer->id, 'order_id' => $orders[0]->id],
        ['referrer_id' => $this->referrer->id, 'order_id' => $orders[1]->id],
        ['referrer_id' => $this->referrer->id, 'order_id' => $orders[2]->id],
    ))->create();

    getJson(route('v3.admin.customer.commission-earnings', ['user' => $this->customer->referred_by]))
        ->assertSuccessful()
        ->assertJsonCount(3, 'data')
        ->assertJsonStructure([
            'data' => [
                [
                    'id',
                    'first_name',
                    'last_name',
                    'full_name',
                    'profile_image',
                    'paid_at',
                    'cards',
                    'submission_total',
                    'commission',
                ],
            ],
        ]);
});

test('an admin can mark an user referral program as inactive', function () {
    actingAs($this->user);

    postJson(route('v3.admin.customer.referral.set-referrers-status', $this->customer->referred_by), [
        'is_referral_active' => false,
    ])
        ->assertSuccessful()
        ->assertJsonFragment([
            'is_referral_active' => false,
        ]);
});
