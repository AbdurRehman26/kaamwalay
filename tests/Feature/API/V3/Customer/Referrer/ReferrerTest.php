<?php

use App\Models\Order;
use App\Models\Referrer;
use App\Models\ReferrerEarnedCommission;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;
use App\Events\API\Auth\CustomerRegistered;
use App\Listeners\API\Referrer\GenerateReferrerOnCustomerRegister;
use App\Services\Referrer\ReferrerService;

use function Pest\Laravel\getJson;
uses(WithFaker::class);

beforeEach(function () {
    $this->referrer = Referrer::factory()->create();
});

test('a referrer can get his own referral data', function () {
    $this->actingAs($this->referrer->user);

    $this->getJson(route('v3.customer.referral'))
        ->assertSuccessful()
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
    $this->actingAs($this->referrer->user);

    User::factory()->count(3)->state(new Sequence(
        ['referred_by' => $this->referrer->user_id],
    ))->create();

    $this->getJson(route('v3.customer.referral.sign-ups'))
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
    $this->actingAs($this->referrer->user);

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

    getJson(route('v3.customer.referral.commission-earnings'))
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

test('a referral code is assigned after user registered', function () {
    $this->seed(RolesSeeder::class);
    Bus::fake();
    Event::fake();

    $email = $this->faker->safeEmail();
    $requestData = [
        'first_name' => $this->faker->firstName(),
        'last_name' => $this->faker->lastName(),
        'email' => $email,
        'username' => $this->faker->userName(),
        'password' => 'passWord1',
        'password_confirmation' => 'password',
        'phone' => '',
    ];

    $this->postJson('/api/v2/auth/register', $requestData);

    Event::assertListening(CustomerRegistered::class, GenerateReferrerOnCustomerRegister::class);

    $user = User::whereEmail($email)->first();
    $listener = new GenerateReferrerOnCustomerRegister(new ReferrerService());
    $listener->handle(new CustomerRegistered($user, $requestData));

    $this->assertNotNull($user->referrer);
    expect($user->referrer->referral_code)->toBeString()->toHaveLength(5);
});
