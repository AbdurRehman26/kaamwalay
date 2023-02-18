<?php

use App\Enums\Order\OrderPaymentStatusEnum;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\Referrer;
use App\Models\User;
use App\Services\ReferralProgram\ReferralCodeGeneratorService;
use Database\Seeders\RolesSeeder;
use Illuminate\Database\Eloquent\Factories\Sequence;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->referrers = Referrer::factory()->count(3)->state(new Sequence(
        ['is_referral_active' => true, 'referral_code' => ReferralCodeGeneratorService::generate()],
        ['is_referral_active' => false, 'referral_code' => ReferralCodeGeneratorService::generate()],
        ['is_referral_active' => true, 'referral_code' => ReferralCodeGeneratorService::generate()]
    ))->create();

    $admin = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->user = User::factory()
        ->withRole(config('permission.roles.customer'))->create([
        'referred_by' => $this->referrers[0]->user_id,
    ]);

    $this->orders = Order::factory()->count(2)->state(new Sequence(
        ['payment_status' => OrderPaymentStatusEnum::PAID, 'order_status_id' => OrderStatus::PLACED, 'user_id' => $this->user->id, 'created_at' => '2022-01-01 00:00:00'],
        ['payment_status' => OrderPaymentStatusEnum::PAID, 'order_status_id' => OrderStatus::CONFIRMED, 'user_id' => $this->user->id, 'created_at' => '2022-02-01 00:00:00'],
    ))->create();

    OrderStatusHistory::factory()->count(2)->sequence(
        ['order_status_id' => $this->orders[0]->order_status_id, 'order_id' => $this->orders[0]->id, 'user_id' => $this->orders[0]->user_id],
        ['order_status_id' => $this->orders[1]->order_status_id, 'order_id' => $this->orders[1]->id, 'user_id' => $this->orders[1]->user_id],
    )->create();

    OrderItem::factory()->count(2)
        ->state(new Sequence(
            [
                'order_id' => $this->orders[0]->id,
            ],
            [
                'order_id' => $this->orders[1]->id,
            ]
        ))
        ->create();

    $this->actingAs($admin);
});

test('an admin can get overview stats for referral program', function () {
    postJson(route('v3.admin.referral-program.get-overview-stat'), [
        'stat_name' => 'sales',
        'time_filter' => 'custom',
        'start_date' => $this->orders[0]->created_at->toDateString(),
        'end_date' => $this->orders[0]->created_at->toDateString(),
    ])
        ->assertSuccessful()
        ->assertJsonFragment([
            'data' => $this->orders[0]->grand_total,
        ]);
});

it('returns referral orders list for admin', function () {
    $this->getJson(route('v3.admin.referral-program.orders'))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                [
                    'id',
                    'order_number',
                    'number_of_cards',
                    'total_declared_value',
                    'grand_total',
                    'owner',
                    'referrer',
                    'payment_status',
                    'created_at',
                ],
            ],
        ]);
});

it('returns referrers list for admin', function () {
    getJson(route('v3.admin.referral-program.referrers'))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                [
                    'profile_image',
                    'first_name',
                    'last_name',
                    'full_name',
                    'customer_number',
                    'email',
                    'phone',
                    'created_at',
                    'submissions',
                    'cards_count',
                    'sign_ups',
                    'is_referral_active',
                    'sales',
                    'commission',
                ],
            ],
        ]);
});

it('filters referrers by referral status', function () {
    $count = Referrer::where('is_referral_active', 0)->count();

    getJson(route('v3.admin.referral-program.referrers', [
        'filter[is_referral_active]' => "0",
    ]))
        ->assertOk()
        ->assertJsonCount($count, ['data'])
        ->assertJsonFragment([
            'id' => $this->referrers[1]->user_id,
        ]);
});

it('returns referees list for admin', function () {
//    dd(User::customer()->whereNotNull('referred_by')->count());
    getJson(route('v3.admin.referral-program.referees'))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                [
                    'profile_image',
                    'first_name',
                    'last_name',
                    'full_name',
                    'customer_number',
                    'email',
                    'phone',
                    'created_at',
                    'submissions',
                    'cards_count',
                    'wallet',
                    'salesman',
                    'referred_by',
                ],
            ],
        ]);
});
