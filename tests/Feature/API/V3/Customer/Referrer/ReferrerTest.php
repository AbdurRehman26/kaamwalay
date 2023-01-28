<?php

use App\Models\Order;
use App\Models\Referrer;
use App\Models\ReferrerEarnedCommission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;

beforeEach(function () {
    $this->referrer = Referrer::factory()->create();
    $this->actingAs($this->referrer->user);
});

test('a referrer can get his own referral data', function () {
    $this->getJson('/api/v3/customer/referral')
        ->assertStatus(200)
        ->assertJsonStructure(['data' => [
            'referrer' => [
                'id',
                'referral_code',
                'referral_url',
                'withdrawable_commission',
                'link_clicks',
                'successful_signups',
                'referral_orders',
                'is_referral_active',
            ],
        ]]);
});

test('a referrer can get information about their referees', function () {
    User::factory()->count(3)->state(new Sequence(
        ['referred_by' => $this->referrer->user_id],
    ))->create();

    $this->getJson('/api/v3/customer/referral/sign-ups')
        ->assertStatus(200)
        ->assertJsonCount(3, 'data')
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

test('a referrer can get information about their commission earnings', function () {
    $users = User::factory()->count(3)->state(new Sequence(
        ['referred_by' => $this->referrer->user_id],
    ))->create();

    $orders = Order::factory()->count(3)->state(new Sequence(
        ['user_id' => $users[0]->id],
        ['user_id' => $users[1]->id],
        ['user_id' => $users[2]->id],
    ))->create();

    ReferrerEarnedCommission::factory()->count(3)->state(new Sequence(
        ['referrer_id' => $this->referrer->id, 'order_id' => $orders[0]->id],
        ['referrer_id' => $this->referrer->id, 'order_id' => $orders[1]->id],
        ['referrer_id' => $this->referrer->id, 'order_id' => $orders[2]->id],
    ))->create();

    $this->getJson('/api/v3/customer/referral/commission-earnings')
        ->assertStatus(200)
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
