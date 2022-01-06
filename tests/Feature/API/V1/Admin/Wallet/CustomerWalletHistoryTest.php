<?php

use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;

use Illuminate\Database\Eloquent\Factories\Sequence;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

test('admin can get a wallet transaction history', function () {
    $this->seed([\Database\Seeders\RolesSeeder::class]);
    $adminUser = User::factory()->withRole(config('permission.roles.admin'))->create();
    $customer = User::factory()->withRole(config('permission.roles.customer'))->create();
    $wallet = Wallet::factory()->create([
        'user_id' => $customer->id,
        'balance' => 5000,
    ]);

    WalletTransaction::factory()->state(new Sequence(
        ['wallet_id' => $wallet->id, 'amount' => 10, 'reason' => WalletTransaction::REASON_ORDER_PAYMENT, 'initiated_by' => $customer->id],
        ['wallet_id' => $wallet->id, 'amount' => 10, 'reason' => WalletTransaction::REASON_REFUND, 'initiated_by' => $adminUser->id],
        ['wallet_id' => $wallet->id, 'amount' => 10, 'reason' => WalletTransaction::REASON_WALLET_CREDIT, 'initiated_by' => $adminUser->id],
    ))->count(3)->create();

    actingAs($adminUser);
    getJson(route('customer-wallet-history', ['wallet' => $customer->wallet]))
        ->dump()
        ->assertOk()
        ->assertJsonCount(3, 'data');
});
