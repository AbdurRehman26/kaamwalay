<?php

use App\Console\Commands\ReferralProgram\ProcessPayoutsHandshake;
use App\Events\API\Admin\ReferralProgram\BatchPayoutCreated;
use App\Models\Referrer;
use App\Models\ReferrerPayout;
use App\Models\ReferrerPayoutStatus;
use App\Models\User;
use App\Services\Admin\V3\ReferralProgram\ReferrerPayoutService;
use App\Services\ReferralProgram\ReferralCodeGeneratorService;
use Database\Seeders\RolesSeeder;

use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Foundation\Testing\WithFaker;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

uses(WithFaker::class);

beforeEach(function () {
    $this->seed([
        RolesSeeder::class,
    ]);

    $this->user = User::factory()->withRole(config('permission.roles.admin'))->create();

    $this->customers = User::factory()->withRole(config('permission.roles.customer'))->count(2)->create();

    $this->referrerPayouts = ReferrerPayout::factory()->count(2)->state(new Sequence(
        ['user_id' => $this->customers[0]->id, 'referrer_payout_status_id' => ReferrerPayoutStatus::STATUS_PENDING, 'payment_method' => 'paypal'],
        ['user_id' => $this->customers[1]->id, 'referrer_payout_status_id' => ReferrerPayoutStatus::STATUS_PROCESSING, 'payment_method' => 'paypal', 'paid_by' => $this->user->id, 'transaction_id' => 'LOREM'],
    ))->create();

    $this->referrer = Referrer::factory()->count(2)->state(new Sequence(
        ['user_id' => $this->customers[0]->id, 'referral_code' => ReferralCodeGeneratorService::generate()],
        ['user_id' => $this->customers[1]->id, 'referral_code' => ReferralCodeGeneratorService::generate()],
    ))->create();

    $this->batchPayoutSuccessfulResponse = Http::response(json_decode(file_get_contents(
        base_path() . '/tests/stubs/Paypal_create_batch_payout_response.json'
    ), associative: true));

    Http::fake(['https://paypal.api/v1/oauth2*' => Http::response(['access_token' => 'Lorem'])]);

    actingAs($this->user);
});

test('an admin can get a list of payouts in the system', function () {
    getJson(route('v3.admin.referral.payouts.index'))
        ->assertSuccessful()
        ->assertJsonCount(2, ['data'])
        ->assertJsonStructure(['data' => [
            '*' => [
                'user',
                'created_at',
                'completed_at',
                'payout_account',
                'paid_by',
                'status',
                'amount',
            ],
        ]]);
});

it('can filter payouts list by user id', function () {
    getJson(route('v3.admin.referral.payouts.index', ['filter[user_id]' => $this->customers[0]->id]))
        ->assertSuccessful()
        ->assertJsonCount(1, ['data']);
});

it('can filter payouts list by status', function () {
    getJson(route('v3.admin.referral.payouts.index', ['filter[referrer_payout_status_id]' => ReferrerPayoutStatus::STATUS_PENDING]))
        ->assertSuccessful()
        ->assertJsonCount(1, ['data']);
});

it('sorts payouts list by created_at DESC', function () {
    $response = getJson(route('v3.admin.referral.payouts.index', ['sort' => '-created_at']))
        ->assertSuccessful();

    $this->assertEquals(
        ReferrerPayout::orderBy('created_at', 'DESC')->first()->id,
        $response->getData()->data[0]->id
    );

    $this->assertEquals(
        ReferrerPayout::orderBy('created_at', 'DESC')->get()[1]->id,
        $response->getData()->data[1]->id
    );
});

it('sorts payouts list by created_at ASC', function () {
    $response = getJson(route('v3.admin.referral.payouts.index', ['sort' => 'created_at']))
        ->assertSuccessful();

    $this->assertEquals(
        ReferrerPayout::orderBy('created_at', 'ASC')->first()->id,
        $response->getData()->data[0]->id
    );

    $this->assertEquals(
        ReferrerPayout::orderBy('created_at', 'ASC')->get()[1]->id,
        $response->getData()->data[1]->id
    );
});

it('sorts payouts list by amount DESC', function () {
    $response = getJson(route('v3.admin.referral.payouts.index', ['sort' => '-amount']))
        ->assertSuccessful();

    $this->assertEquals(
        ReferrerPayout::orderBy('amount', 'DESC')->first()->id,
        $response->getData()->data[0]->id
    );

    $this->assertEquals(
        ReferrerPayout::orderBy('amount', 'DESC')->get()[1]->id,
        $response->getData()->data[1]->id
    );
});

it('sorts payouts list by amount ASC', function () {
    $response = getJson(route('v3.admin.referral.payouts.index', ['sort' => 'amount']))
        ->assertSuccessful();

    $this->assertEquals(
        ReferrerPayout::orderBy('amount', 'ASC')->first()->id,
        $response->getData()->data[0]->id
    );

    $this->assertEquals(
        ReferrerPayout::orderBy('amount', 'ASC')->get()[1]->id,
        $response->getData()->data[1]->id
    );
});

it('can search payouts by customer information', function () {
    getJson(route('v3.admin.referral.payouts.index', ['filter[search]' => $this->customers[0]->email]))
        ->assertSuccessful()
        ->assertJsonCount(1, ['data']);
});

test('an admin can approve and create a batch payout with item ids', function () {
    Event::fake();
    postJson(route('v3.admin.referral.payouts.store'), [
        'items' => [$this->referrerPayouts[0]->id],
    ])->assertSuccessful();

    Event::assertDispatched(BatchPayoutCreated::class);
});

test('an admin can approve and create a batch payout for all pending elements', function () {
    Event::fake();
    postJson(route('v3.admin.referral.payouts.store'), [
        'all_pending' => true,
    ])->assertSuccessful();

    Event::assertDispatched(BatchPayoutCreated::class);
});

test('batch payout creation needs params', function () {
    postJson(route('v3.admin.referral.payouts.store'))->assertStatus(422);
});

test('a batch payout is processed and stores data into DB', function () {
    Http::fake(['https://paypal.api/v1/payments/payouts' => $this->batchPayoutSuccessfulResponse]);

    $baseResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/Paypal_batch_payout_details_response.json'
    ), associative: true);

    $baseResponse['items'][0]['payout_item']['sender_item_id'] .= '-'.$this->referrerPayouts[0]->id;

    Http::fake(['https://paypal.api/v1/payments/payouts/*' => Http::response($baseResponse)]);

    $referrerPayoutService = resolve(ReferrerPayoutService::class);
    $referrerPayoutService->processBatchPayout(['items' => [$this->referrerPayouts[0]->id]]);

    $payout = ReferrerPayout::find($this->referrerPayouts[0]->id);

    expect($payout->referrer_payout_status_id)->toBe(ReferrerPayoutStatus::STATUS_COMPLETED)
        ->and($payout->transaction_id)->toBe($baseResponse['items'][0]['payout_item_id'])
        ->and($payout->transaction_status)->toBe($baseResponse['items'][0]['transaction_status']);
});

test('if batch fails, the amounts are returned to referrer withdrawable commission', function () {
    Http::fake(['https://paypal.api/v1/payments/*' => Http::response(json_decode(file_get_contents(
        base_path() . '/tests/stubs/Paypal_create_batch_payout_fail_response.json'
    ), associative: true))]);

    $payout = ReferrerPayout::find($this->referrerPayouts[0]->id);
    $referrer = $payout->user->referrer;
    $withdrawableCommission = $referrer->withdrawable_commission;

    $referrerPayoutService = resolve(ReferrerPayoutService::class);
    $referrerPayoutService->processBatchPayout(['items' => [$this->referrerPayouts[0]->id]]);

    expect($referrer->fresh()->withdrawable_commission)->toBe(round($withdrawableCommission + $payout->amount, 2));
});

test('if batch call is successful but item fails, the amount is returned to referrer', function () {
    Http::fake(['https://paypal.api/v1/payments/payouts' => $this->batchPayoutSuccessfulResponse]);

    $baseResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/Paypal_batch_payout_details_fail_response.json'
    ), associative: true);

    $baseResponse['items'][0]['payout_item']['sender_item_id'] .= '-'.$this->referrerPayouts[0]->id;

    Http::fake(['https://paypal.api/v1/payments/payouts/*' => Http::response($baseResponse)]);

    $payout = ReferrerPayout::find($this->referrerPayouts[0]->id);
    $referrer = $payout->user->referrer;
    $withdrawableCommission = $referrer->withdrawable_commission;

    $referrerPayoutService = resolve(ReferrerPayoutService::class);
    $referrerPayoutService->processBatchPayout(['items' => [$this->referrerPayouts[0]->id]]);

    $payout = $payout->fresh();

    expect($payout->referrer_payout_status_id)->toBe(ReferrerPayoutStatus::STATUS_FAILED)
        ->and($payout->transaction_id)->toBe($baseResponse['items'][0]['payout_item_id'])
        ->and($payout->transaction_status)->toBe($baseResponse['items'][0]['transaction_status'])
        ->and($referrer->fresh()->withdrawable_commission)->toBe(round($withdrawableCommission + $payout->amount, 2));
});

it('process payouts handshake', function () {
    $this->artisan(ProcessPayoutsHandshake::class)
        ->assertExitCode(0);
});

test('handshake cron is handled and stores data into DB', function () {
    $baseResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/Paypal_payout_item_details_response.json'
    ), associative: true);

    $baseResponse['payout_item']['sender_item_id'] .= '-'.$this->referrerPayouts[1]->id;

    Http::fake(['https://paypal.api/v1/payments/*' => Http::response($baseResponse)]);

    $referrerPayoutService = resolve(ReferrerPayoutService::class);
    $referrerPayoutService->processPayoutHandshake($this->referrerPayouts[1]);

    $payout = ReferrerPayout::find($this->referrerPayouts[1]->id);

    expect($payout->referrer_payout_status_id)->toBe(ReferrerPayoutStatus::STATUS_COMPLETED);
});

test('if item transaction fails in handshake, the amount is returned to referrer', function () {
    $baseResponse = json_decode(file_get_contents(
        base_path() . '/tests/stubs/Paypal_payout_item_details_fail_response.json'
    ), associative: true);

    $baseResponse['payout_item']['sender_item_id'] .= '-'.$this->referrerPayouts[1]->id;

    Http::fake(['https://paypal.api/v1/payments/*' => Http::response($baseResponse)]);

    $payout = ReferrerPayout::find($this->referrerPayouts[1]->id);
    $referrer = $payout->user->referrer;
    $withdrawableCommission = $referrer->withdrawable_commission;

    $referrerPayoutService = resolve(ReferrerPayoutService::class);
    $referrerPayoutService->processPayoutHandshake($this->referrerPayouts[1]);

    $payout = $payout->fresh();

    expect($payout->referrer_payout_status_id)->toBe(ReferrerPayoutStatus::STATUS_FAILED)
        ->and($payout->transaction_status)->toBe($baseResponse['transaction_status'])
        ->and($referrer->fresh()->withdrawable_commission)->toBe(round($withdrawableCommission + $payout->amount, 2));
});
