<?php

use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

beforeEach(function () {
    $this->customer = User::factory()->withRole(config('permission.roles.customer'))->create();
    $this->wallet = Wallet::factory()->for($this->customer)->create();

    WalletTransaction::factory()->for($this->wallet)->count(20)->create();
});

it('gets wallet information for logged in user', function () {
    actingAs($this->customer);
    getJson(route('v1.wallet.me'))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'balance',
            ],
        ]);
});

it('does not return wallet information for guest user', function () {
    getJson(route('v1.wallet.me'))
        ->assertUnauthorized();
});

it('gets wallet transactions for logged in user', function () {
    actingAs($this->customer);
    getJson(route('v1.wallet.transactions'))
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'created_at',
                    'description',
                    'amount',
                ],
            ],
        ]);
});
