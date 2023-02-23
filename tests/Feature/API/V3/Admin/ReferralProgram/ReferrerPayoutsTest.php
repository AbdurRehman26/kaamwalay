<?php

use App\Events\API\Admin\ReferralProgram\BatchPayoutCreated;
use App\Models\Referrer;
use App\Models\ReferrerPayout;
use App\Models\ReferrerPayoutStatus;
use App\Models\User;
use Database\Seeders\RolesSeeder;
use Illuminate\Foundation\Testing\WithFaker;
use App\Console\Commands\ReferralProgram\ProcessPayoutsHandshake;
use App\Services\ReferralProgram\ReferralCodeGeneratorService;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function PHPUnit\Framework\assertEquals;
use Illuminate\Database\Eloquent\Factories\Sequence;
use App\Services\Admin\V3\ReferralProgram\ReferrerPayoutService;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();

    $this->customers = User::factory()->withRole(config('permission.roles.customer'))->count(2)->create();

    $this->referrerPayouts = ReferrerPayout::factory()->count(2)->state(new Sequence(
        ['user_id' => $this->customers[0]->id, 'referrer_payout_status_id' => ReferrerPayoutStatus::STATUS_PENDING, 'payment_method' => 'paypal'],
        ['user_id' => $this->customers[1]->id, 'referrer_payout_status_id' => ReferrerPayoutStatus::STATUS_PROCESSING, 'payment_method' => 'paypal'],
    ))->create();

    $this->referrer = Referrer::factory()->count(2)->state(new Sequence(
        ['user_id' => $this->customers[0]->id, 'referral_code' => ReferralCodeGeneratorService::generate()],
        ['user_id' => $this->customers[1]->id, 'referral_code' => ReferralCodeGeneratorService::generate()],
    ))->create();

    actingAs($this->user);

});

test('an admin can get a list of payouts in the system', function () {
    getJson(route('v3.admin.referral.payouts.index'))
        ->assertSuccessful()
        ->assertJsonCount(2, ['data'])
        ->assertJsonStructure(['data' => [
            '*' => [
                'user',
                'initiated_at',
                'completed_at',
                'payout_account',
                'paid_by',
                'status',
                'amount',
            ],
        ]]);
});

it('can filter payouts list by user id', function () {

    getJson(route('v3.admin.referral.payouts.index',['filter[user_id]' => $this->customers[0]->id]))
        ->assertSuccessful()
        ->assertJsonCount(1, ['data']);
});

it('can filter payouts list by status', function () {
    getJson(route('v3.admin.referral.payouts.index',['filter[referrer_payout_status_id]' => ReferrerPayoutStatus::STATUS_PENDING]))
        ->assertSuccessful()
        ->assertJsonCount(1, ['data']);
});

it('can search payouts by customer information', function () {
    getJson(route('v3.admin.referral.payouts.index',['filter[search]' => $this->customers[0]->email]))
        ->assertSuccessful()
        ->assertJsonCount(1, ['data']);
});

test('an admin can approve and create a batch payout with item ids', function (){
    Event::fake();
    postJson(route('v3.admin.referral.payouts.store'), [
        'items' => [$this->referrerPayouts[0]->id]
    ])->assertSuccessful();

    Event::assertDispatched(BatchPayoutCreated::class);
});

test('an admin can approve and create a batch payout for all pending elements', function (){
    Event::fake();
    postJson(route('v3.admin.referral.payouts.store'), [
        'all_pending' => true
    ])->assertSuccessful();

    Event::assertDispatched(BatchPayoutCreated::class);
});

test('batch payout creation needs params', function(){
    postJson(route('v3.admin.referral.payouts.store'))->assertStatus(422);
});
//
//test('a batch payout is processed and stores data into DB', function(){
//    Http::fake(['*/v1/payments/payouts?*' => Http::response(json_decode(file_get_contents(
//        base_path() . '/tests/stubs/Paypal_create_batch_payout_response.json'
//    ), associative: true))]);
//
//    Http::fake(['*/v1/payments/payouts/*' => Http::response(json_decode(file_get_contents(
//        base_path() . '/tests/stubs/Paypal_batch_payout_details_response.json'
//    ), associative: true))]);
//
//    $referrerPayoutService = resolve(ReferrerPayoutService::class);
//    $referrerPayoutService->processBatchPayout(['items' => [$this->referrerPayouts[0]->id]]);
//
//    $payout = ReferrerPayout::find($this->referrerPayouts[0]->id);
//    dd($payout);
//});

it('process payouts handshake', function () {
    $this->artisan(ProcessPayoutsHandshake::class)
        ->assertExitCode(0);
});

test('if batch fails, the amounts are returned to referrer withdrawable commission', function(){
    Http::fake(['*/v1/payments/*' => Http::response(json_decode(file_get_contents(
        base_path() . '/tests/stubs/Paypal_create_batch_payout_fails_response.json'
    ), associative: true))]);

    $payout = ReferrerPayout::find($this->referrerPayouts[0]->id);
    $referrer = $payout->user->referrer;
    $withdrawableCommission = $referrer->withdrawable_commission;

    $referrerPayoutService = resolve(ReferrerPayoutService::class);
    $referrerPayoutService->processBatchPayout(['items' => [$this->referrerPayouts[0]->id]]);

    expect($referrer->fresh()->withdrawable_commission)->toBe($withdrawableCommission + $payout->amount);
});
