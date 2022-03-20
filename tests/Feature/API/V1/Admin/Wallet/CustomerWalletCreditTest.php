<?php

use App\Models\User;
use App\Models\Wallet;
use Database\Seeders\RolesSeeder;
use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\postJson;

beforeEach(function () {
    $this->seed([RolesSeeder::class]);

    $user = User::factory()->withRole(config('permission.roles.admin'))->create();

    $this->customer = User::factory()->withRole(config('permission.roles.customer'))->create();

    Wallet::createWallet($this->customer);

    $this->actingAs($user);
});

test('admin can credit amount in customer\'s wallet that doesnt have balance', function () {
    $amount = (float) 50;
    postJson(
        route('v1.customer.wallet.credit', ['wallet' => $this->customer->wallet]),
        ['amount' => $amount]
    )->assertCreated();

    assertDatabaseCount('wallet_transactions', 1);
    expect($this->customer->wallet->lastTransaction->amount)->toBe($amount);
    expect($this->customer->wallet->refresh()->balance)->toBe($amount);
});

test('admin can credit amount in customer\'s wallet that has balance', function () {
    $newCustomer = User::factory()->withRole(config('permission.roles.customer'))->create();
    Wallet::factory()->create([
        'user_id' => $newCustomer->id,
        'balance' => 44.5,
    ]);

    $oldBalance = $newCustomer->wallet->balance;
    $amount = (float) 29;
    postJson(
        route('v1.customer.wallet.credit', ['wallet' => $newCustomer->wallet]),
        ['amount' => $amount]
    )->assertCreated();

    assertDatabaseCount('wallet_transactions', 1);
    expect($newCustomer->wallet->lastTransaction->amount)->toBe($amount);
    expect($newCustomer->wallet->refresh()->balance)->toBe($amount + $oldBalance);
});
